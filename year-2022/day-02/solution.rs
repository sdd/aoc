fn main() {
    let s: Vec<i64> = include_str!("input-01.txt").lines()
        .filter_map(|s| s.parse().ok())
        .collect();

    let part1 = s.windows(2).filter(|&w| w[1] > w[0]).count();
    let part2 = s.windows(4).filter(|&w| w[3] > w[0]).count();

    println!("Part 1: {:?}, Part 2: {:?}", &part1, &part2);
}