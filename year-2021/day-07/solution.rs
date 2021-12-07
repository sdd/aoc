fn main() {
    let raw = include_str!("input-01.txt");
    let crabs: Vec<i64> = raw.split(',').filter_map(|s|s.trim().parse().ok()).collect();
    let max_crab = *crabs.iter().max().unwrap();

    let p1: i64 = (0i64..=max_crab).map(|i|
        crabs.iter().map(|&crab| (crab - i).abs()).sum()
    )
    .min().unwrap();
    println!("p1: {:?}", p1);

    let p2: i64 = (0i64..=max_crab).map(|i|
        crabs.iter().map(|&crab| triangle((crab - i).abs())).sum()
    )
    .min().unwrap();
    println!("p2: {:?}", p2);
}

fn triangle(i: i64) -> i64 {
    (i * (i + 1)) / 2
}