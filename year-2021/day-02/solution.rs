#[derive(Debug, PartialEq)]
pub enum Instruction {
    Forward(u64),
    Down(u64),
    Up(u64),
}

peg::parser! {
    grammar instruction_parser() for str {
        rule number() -> u64 = n:$(['0'..='9']+) {? n.parse().or(Err("u64")) }

        rule forward() -> Instruction = "forward " n:number() { Instruction::Forward(n) }
        rule down() -> Instruction = "down " n:number() { Instruction::Down(n) }
        rule up() -> Instruction = "up " n:number() { Instruction::Up(n) }

        pub rule line() -> Instruction = forward() / up() / down()
    }
}

fn main() {
    let instructions: Vec<_> = include_str!("input-01.txt").lines()
        .filter_map(|s| instruction_parser::line(s).ok())
        .collect();

    let mut x = 0u64;
    let mut d = 0u64;
    for instruction in &instructions {
        match instruction {
            Instruction::Forward(dist) => { x += dist; },
            Instruction::Down(dist) => { d += dist; },
            Instruction::Up(dist) => { d -= dist; },
        }
    }
    println!("Part 1: {}", x * d);

    let mut x = 0u64;
    let mut d = 0u64;
    let mut a = 0u64;
    for instruction in &instructions {
        match instruction {
            Instruction::Forward(dist) => {
                x += dist;
                d += dist * a;
            },
            Instruction::Down(dist) => { a += dist; },
            Instruction::Up(dist) => { a -= dist; },
        }
    }

    println!("Part 2: {}", x * d);
}