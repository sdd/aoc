use std::collections::{HashSet, HashMap};
use std::array::IntoIter;
use std::iter::FromIterator;

use strum_macros::EnumString;

#[derive(Debug,PartialEq,Eq,Hash,Clone,EnumString)]
#[strum(ascii_case_insensitive)]
enum Seg { A, B, C, D, E, F, G }

type Pattern = HashSet<Seg>;
type Digit = HashSet<Seg>;
type Patterns = Vec<Pattern>;
type Digits = Vec<Digit>;
type Wiring = HashMap<Seg, Seg>;

const FULL_SET: Pattern = HashSet::from_iter(IntoIter::new([
    Seg::A, Seg::B, Seg::C, Seg::D, Seg::E, Seg::F, Seg::G
]));

const PATTERN_TO_NUMERAL: HashMap<HashSet<Seg>, u64> = HashMap::from_iter(IntoIter::<(HashSet<Seg>, u64)>.new([
    (HashSet::from([Seg::A, Seg::B, Seg::C, Seg::E, Seg::F, Seg::G]), 0u64),
    (HashSet::from([Seg::C, Seg::F]), 1u64),
    (HashSet::from([Seg::A, Seg::C, Seg::D, Seg::E, Seg::G]), 2u64),
    (HashSet::from([Seg::A, Seg::C, Seg::D, Seg::F, Seg::G]), 3u64),
    (HashSet::from([Seg::B, Seg::C, Seg::D, Seg::F]), 4u64),
    (HashSet::from([Seg::A, Seg::B, Seg::D, Seg::F, Seg::G]), 5u64),
    (HashSet::from([Seg::A, Seg::B, Seg::D, Seg::E, Seg::F, Seg::G]), 6u64),
    (HashSet::from([Seg::A, Seg::C, Seg::F]), 7u64),
    (HashSet::from([Seg::A, Seg::B, Seg::C, Seg::D, Seg::E, Seg::F, Seg::G]), 8u64),
    (HashSet::from([Seg::A, Seg::B, Seg::C, Seg::D, Seg::F, Seg::G]), 9u64),
]));

fn main() {
    let raw = include_str!("input-01.txt");
    let lines: Vec<(Patterns, Digits)> = raw.lines().filter_map(|raw_line|{
        let [raw_inputs, raw_outputs] = raw_line.trim().split(" | ");
        
        let patterns: Patterns = raw_inputs.split(' ').map(|p|
            p.chars().map(|c| Seg::from_str()).collect()
        ).collect();

        let digits: Digits = raw_outputs.split(' ').map(|p|
            p.chars().map(|c| Seg::from_str()).collect()
        ).collect();

        Some((patterns, digits))
    }).collect();

    let p2 = part2(lines);
    println!("PART2: {:?}", p2);
}

pub fn part2(lines: Vec<(Patterns, Digits)>) -> u64 {
    lines.into_iter().map(|line| solve(line)).sum()
}

pub fn solve(line: (Patterns, Digits)) -> u64 {
    let (patterns, digits) = line;
    let wiring: Wiring = solve_wiring(patterns);
    
    digits.iter()
        .map(|d| PATTERN_TO_NUMERAL.get(d))
        .fold(0,|acc, digit| acc * 10 + digit)
}

pub fn solve_wiring(mut patterns: Vec<HashSet<Seg>>) -> Wiring {
    patterns.sort_by(|a, b| a.len().partial_cmp(&b.len()).unwrap());

    let mut wiring: Wiring = HashMap::new();
    let mut set_cf: Pattern = HashSet::new();
    let mut set_bd: Pattern = HashSet::new();
    
    for pattern in patterns {
        match pattern.len() {
            2 => { // pattern for digit 1 (cf)
                set_cf = pattern.clone();
            },
            3 => { // pattern for digit 7 (acf)
               wiring.insert(Seg::A, pattern.difference(&set_cf).iter().next());
            },
            4 => { // pattern for digit 4 (bcdf)
               set_bd.insert(pattern.difference(&set_cf).iter().next());
            },
            5 if pattern.intersection(&set_cf).len() == 2 => { // pattern for digit 3
               let mut set_be: HashSet<_> = FULL_SET.difference(&pattern).collect();
               let b = set_be.intersection(&set_bd).iter().next();
               wiring.insert(Seg::B, b);
               set_bd.remove(&b);
               wiring.insert(Seg::D, set_bd.iter().next().unwrap().clone());
                set_be.remove(&b);
               wiring.insert(Seg::E, set_be.iter().next().unwrap().clone());
            },
            6 if pattern.intersection(&set_cf).len() != 2 => { // pattern for digit 6
                let c = FULL_SET.difference(&pattern).iter().next();
                wiring.insert(Seg::C, c);
                wiring.insert(Seg::F, set_cf.clone().remove(c).iter().next());
                let known = wiring.values().iter();
                wiring.insert(Seg::G, FULL_SET.difference(&HashSet::from_iter(known)).iter().next());
            },
            _ => ()
        }
    }
    wiring 
}
