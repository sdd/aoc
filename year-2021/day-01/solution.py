with open("input-01.txt") as fp:
    nums = [ int(i) for i in fp.readlines() ]
    
    part1 = len([ a for (a, b) in zip(nums, nums[1:]) if b > a ])
    part2 = len([ a for (a, b) in zip(nums, nums[3:]) if b > a ])

    print(f'part1: {part1}, part2: {part2}')
