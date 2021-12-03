fn main() {
    let input = include_str!("input-01.txt");
    let nbits = input.lines().next().unwrap().len() as u32;
    let total = input.lines().count() as u64;
    
    let part1: u64 = input.lines()
        .fold(vec![0u64; nbits as usize], |mut acc, line| {
            line.chars().enumerate().for_each(|(idx, chr)| if chr == '1' { acc[idx] += 1 });
            acc
        })
        .iter().enumerate().fold([0u64; 2], |mut acc, (idx, &count)| {
            acc[if count * 2 >= total { 0 } else { 1 }] += 2u64.pow(nbits - idx as u32 - 1);
            acc
        })
        .into_iter().product();

    println!("part1 = {:?}", part1);
}