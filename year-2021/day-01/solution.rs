fn main() -> anyhow::Result<()> {
    let s: Vec<_> = include_str!("input-01.txt")
        .split('\n')
        .filter_map(|s| s.parse::<i64>().ok())
        .collect();

    let part1 = s.iter().zip(s[1..].iter()).filter(|(a, b)| b > a).count();
    let part2 = s.iter().zip(s[3..].iter()).filter(|(a, b)| b > a).count();

    println!("Part 1: {:?}, Part 2: {:?}", &part1, &part2);
    Ok(())
}