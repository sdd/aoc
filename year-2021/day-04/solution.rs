use std::collections::HashSet;
use regex::Regex;
use itertools::{any, all};

fn main() {
    let input = include_str!("input-01.txt");
    let mut groups = input.split("\n\n");

    let callouts: Vec<u64> = groups.next().unwrap()
        .split(',')
        .filter_map(|s|s.parse().ok())
        .collect();

    let boards: Vec<Vec<Vec<u64>>> = groups.map(|group| {
        group.lines().map(|line|{
            Regex::new(r"\s+").unwrap().split(line).into_iter().filter_map(|s|s.parse().ok()).collect()
        }).collect()
    }).collect();

    part1(&callouts, &boards);
    part2(&callouts, &boards);
}

pub fn part1(callouts: &[u64], boards: &[Vec<Vec<u64>>]) {
    let mut called: HashSet<u64> = HashSet::new();
    for &callout in callouts {
        called.insert(callout);

        for board in boards.iter() {
            let won = any(board.iter(), |row| all(row.iter(), |cell| called.contains(cell)))
                || any(0..5, |col_idx| all(board.iter().map(|row| row[col_idx]), |cell| called.contains(&cell)));

            if won {
                let score: u64 = board.iter().flatten().filter(|&cell| !called.contains(cell)).sum();
                println!("part 1: {:?}", score * callout);
                return;
            }
        }
    }
}

pub fn part2(callouts: &[u64], boards: &[Vec<Vec<u64>>]) {
    let mut called: HashSet<u64> = HashSet::new();
    let mut remaining_boards: HashSet<u64> = HashSet::from_iter(0..boards.len() as u64);

    for &callout in callouts {
        called.insert(callout);

        for (idx, board) in boards.iter().enumerate() {
            let won = any(board.iter(), |row| all(row.iter(), |cell| called.contains(cell)))
                || any(0..5, |col_idx| all(board.iter().map(|row| row[col_idx]), |cell| called.contains(&cell)));

            if won {
                remaining_boards.remove(&(idx as u64));
                if remaining_boards.is_empty() {
                    let score: u64 = board.iter().flatten().filter(|&cell| !called.contains(cell)).sum();
                    println!("part 2: {:?}", score * callout);
                    return;
                }
            }
        }
    }
}
