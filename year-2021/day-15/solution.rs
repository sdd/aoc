#![feature(format_args_capture)]
#![feature(int_abs_diff)]

use std::borrow::BorrowMut;
use std::cell::{RefCell};
use std::cmp::Ordering;
use std::ops::{Deref, Neg};
use priority_queue::PriorityQueue;

#[derive(Copy, Clone, PartialEq, Debug)]
struct F(f64);

impl Eq for F {}

impl PartialOrd for F {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.0.partial_cmp(&other.0).unwrap())
    }
}

impl Ord for F {
    fn cmp(&self, other: &Self) -> Ordering {
        self.0.partial_cmp(&other.0).unwrap()
    }
}

impl Neg for F {
    type Output = F;

    fn neg(self) -> Self::Output {
        F(0f64 - self.0)
    }
}

#[derive(Debug)]
pub struct Node {
    idx: usize,
    x: usize,
    y: usize,
    weight: u32,

    visited: bool,
    closed: bool,
    parent: Option<usize>,

    f: F,
    g: f64,
    h: f64,
}

impl Ord for Node {
    fn cmp(&self, other: &Self) -> Ordering {
        self.f.partial_cmp(&other.f).unwrap()
    }
}

impl PartialOrd<Self> for Node {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        self.f.partial_cmp(&other.f)
    }
}

impl PartialEq<Self> for Node {
    fn eq(&self, other: &Self) -> bool {
        self.f == other.f
    }
}

impl Eq for Node {}

#[derive(Debug)]
pub struct Grid {
    nodes: Vec<RefCell<Node>>,
    width: usize,
    height: usize,
}

impl Node {
    pub fn new(idx: usize, x: usize, y: usize, weight: u32) -> Node {
        Node { idx, x, y, weight, visited: false, closed: false, parent: None, f: F(0f64), g: 0f64, h: 0f64 }
    }
}

impl Grid {
    pub fn path(&self, idx: usize) -> Vec<usize> {
        let mut path = vec![];
        let mut curr = self.nodes[idx].borrow().idx;
        while let Some(parent) = self.nodes[curr].borrow().parent {
            path.push(parent);
            curr = self.nodes[parent].borrow().idx;
        }
        path
    }

    pub fn get_neighbours(&self, idx: usize) -> Vec<usize> {
        let mut neighbours = vec![];

        if idx >= self.width {
            neighbours.push(idx - self.width);
        }
        if idx < self.width * (self.height - 1) {
            neighbours.push(idx + self.width);
        }
        if idx % self.width > 0 {
            neighbours.push(idx - 1);
        }
        if idx % self.width < self.width - 1 {
            neighbours.push(idx + 1);
        }

        neighbours
    }

    pub fn shortest_path(&mut self, start_idx: usize, end_idx: usize) -> Vec<usize> {
        let start_h = manhattan(
            &self.nodes.get(start_idx).unwrap().borrow(),
            &self.nodes.get(end_idx).unwrap().borrow(),
        );

        self.nodes.get(start_idx).unwrap().borrow_mut().h = start_h;

        let mut open: PriorityQueue<usize, F> = PriorityQueue::new();
        open.push(start_idx, F(0f64));

        while let Some((current_idx, _)) = open.pop() {
            if current_idx == end_idx {
                return self.path(current_idx).clone();
            }
            
            let mut current = self.nodes.get(current_idx).unwrap().borrow_mut();
            current.closed = true;

            let neighbours = self.get_neighbours(current.idx);
            for neighbour_idx in neighbours {
                let mut neighbour = self.nodes.get(neighbour_idx).unwrap().borrow_mut();

                if neighbour.closed {
                    continue;
                }

                let already_visited = neighbour.visited;

                if !already_visited || ((current.g + neighbour.weight as f64) < neighbour.g) {
                    neighbour.visited = true;
                    neighbour.parent = Some(current.idx);
                    if neighbour.h == 0f64 && neighbour_idx != end_idx {
                        neighbour.h = manhattan(neighbour.deref(), &self.nodes.get(end_idx).unwrap().borrow());
                    }
                    neighbour.g = current.g + neighbour.weight as f64;
                    neighbour.f = F(neighbour.g + neighbour.h);

                }

                if !already_visited {
                    neighbour.parent = Some(current_idx);
                    open.push(neighbour.idx, -neighbour.f);
                } else {
                    open.change_priority(&neighbour.idx, -neighbour.f);
                }
            }
        }

        vec![]
    }
}

pub fn manhattan(a: &Node, b: &Node) -> f64 {
    (a.x.abs_diff(b.x) + a.y.abs_diff(b.y)) as f64
}

fn main() {
    let raw = include_str!("input-01.txt");
    // let raw = include_str!("example-01.txt");

    let raw_grid: Vec<Vec<u32>> = raw.lines().map(|line|
        line.chars().filter_map(|char| char.to_digit(10)).collect()
    ).collect();
    let width = raw_grid.len();
    let height = raw_grid[0].len();

    let nodes: Vec<RefCell<Node>> = raw.lines().enumerate().map(move |(y, row)|
        row.chars().enumerate().filter_map(move |(x, char)|
            char.to_digit(10).map(move |weight|
                Node::new(x + y * width, x, y, weight)
            ))
    ).flatten()
    .map(|n| RefCell::new(n))
    .collect();
    let mut grid: Grid = Grid { nodes, width, height };

    let path = grid.shortest_path(0, width * height - 1);

    let dist: u32 = path.iter().map(|&idx| grid.nodes.get(idx).unwrap().borrow().weight).sum();
    let dist = dist - grid.nodes[0].borrow().weight as u32 + grid.nodes[width * height - 1].borrow().weight as u32;
    println!("part1: {dist:?}");

    let full_width = width * 5;
    let full_height = height * 5;
    let mut full_nodes = vec![];
    for y in 0..full_height {
        for x in 0..full_width {
            let cellx = x / width;
            let celly = y / height;
            let added = (cellx + celly) as u32;

            let weight =  ((grid.nodes[(y % height) * width + (x % width)].borrow().weight + added - 1) % 9) + 1;
            full_nodes.push(
                RefCell::new(Node::new(x + y * full_width, x, y, weight))
            );
        }
    }
    let mut full_grid: Grid = Grid { nodes: full_nodes, width: full_width, height: full_height };

    let path = full_grid.shortest_path(0, full_width * full_height - 1);

    let dist: u32 = path.iter().map(|&idx| full_grid.nodes.get(idx).unwrap().borrow().weight).sum();
    let dist = dist - full_grid.nodes[0].borrow().weight as u32 + full_grid.nodes[full_width * full_height - 1].borrow().weight as u32;
    println!("part2: {dist:?}");
}