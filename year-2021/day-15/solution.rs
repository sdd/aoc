#![feature(format_args_capture)]
#![feature(int_abs_diff)]

use std::borrow::BorrowMut;
use std::cell::{RefCell};
use std::cmp::Ordering;
use std::ops::{Deref, Neg};
use std::time::Instant;
use priority_queue::PriorityQueue;

#[derive(Debug)]
pub struct Node {
    idx: usize,
    x: usize,
    y: usize,

    visited: bool,
    closed: bool,
    parent: Option<usize>,

    weight: u32,
    f: u32,
    g: u32,
    h: u32,
}

impl Ord for Node {
    fn cmp(&self, other: &Self) -> Ordering {
        self.f.cmp(&other.f)
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
        Node { idx, x, y, weight, visited: false, closed: false, parent: None, f: 0, g: 0, h: 0 }
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

        let mut open: PriorityQueue<usize, u32> = PriorityQueue::new();
        open.push(start_idx, 0);

        while let Some((current_idx, _)) = open.pop() {
            if current_idx == end_idx {
                return self.path(current_idx).clone();
            }
            
            let mut current = self.nodes.get(current_idx).unwrap().borrow_mut();
            current.closed = true;

            for neighbour_idx in self.get_neighbours(current.idx) {
                let mut neighbour = self.nodes.get(neighbour_idx).unwrap().borrow_mut();

                if neighbour.closed {
                    continue;
                }

                let already_visited = neighbour.visited;

                if !already_visited || (current.g + neighbour.weight < neighbour.g) {
                    neighbour.visited = true;
                    neighbour.parent = Some(current.idx);
                    if neighbour.h == 0 && neighbour_idx != end_idx {
                        neighbour.h = manhattan(neighbour.deref(), &self.nodes.get(end_idx).unwrap().borrow());
                    }
                    neighbour.g = current.g + neighbour.weight;
                    neighbour.f = neighbour.g + neighbour.h;

                }

                if !already_visited {
                    neighbour.parent = Some(current_idx);
                    open.push(neighbour.idx, u32::MAX - neighbour.f);
                } else {
                    open.change_priority(&neighbour.idx, u32::MAX - neighbour.f);
                }
            }
        }

        vec![]
    }
}

pub fn manhattan(a: &Node, b: &Node) -> u32 {
    (a.x.abs_diff(b.x) + a.y.abs_diff(b.y)) as u32
}

fn main() {
    let start = Instant::now();
    let raw = include_str!("input-01.txt");
    // let raw = include_str!("example-01.txt");

    let raw_grid: Vec<Vec<u32>> = raw.lines().map(|line|
        line.chars().filter_map(|char| (char.to_digit(10).unwrap() as u32).into()).collect()
    ).collect();
    let width = raw_grid.len();
    let height = raw_grid[0].len();

    // build Grid object for part 1
    let nodes: Vec<RefCell<Node>> = raw.lines().enumerate().map(move |(y, row)|
        row.chars().enumerate().filter_map(move |(x, char)|
            char.to_digit(10).map(move |weight|
                Node::new(x + y * width, x, y, weight as u32)
            ))
    ).flatten()
    .map(|n| RefCell::new(n))
    .collect();
    let mut grid: Grid = Grid { nodes, width, height };

    // calc the path for part 1
    let path = grid.shortest_path(0, width * height - 1);

    let risk = calc_path_risk(width, height, &mut grid, path);
    println!("part1: {risk:?}");
    println!("elapsed: {}ms", start.elapsed().as_millis());

    let start = Instant::now();

    // build the Grid object for part 2
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

    // calc the path for part 1
    let path = full_grid.shortest_path(0, full_width * full_height - 1);

    let risk = calc_path_risk(full_width, full_height, &mut full_grid, path);
    println!("part2: {risk:?}");
    println!("elapsed: {}ms", start.elapsed().as_millis());
    //println!("full_grid: {full_grid:?}");
}

pub fn calc_path_risk(width: usize, height: usize, grid: &mut Grid, path: Vec<usize>) -> u32 {
    let dist: u32 = path.iter().map(|&idx| grid.nodes.get(idx).unwrap().borrow().weight).sum();

    // adjust dist to remove weight for start and add weight for end
    dist - grid.nodes[0].borrow().weight as u32 + grid.nodes[width * height - 1].borrow().weight as u32
}