fn main() -> anyhow::Result<()> {
    let s: Vec<_> = include_str!("input-01.txt")
        .split('\n')
        .filter_map(|s| s.parse::<i64>().ok())
        .collect();

    let part1 = s.iter().zip(s.iter().skip(1))
        .map(|(a, b)| b > a)
        .filter(|&x|x)
        .count();

    println!("Part 1: {:?}", &part1);

    let part2 = s.iter().zip(s.iter().skip(3))
        .map(|(a, b)| b > a)
        .filter(|&x|x)
        .count();

    println!("Part 2: {:?}", &part2);

    Ok(())
}