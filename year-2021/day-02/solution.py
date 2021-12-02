with open("input-01.txt") as fp:
    inp = [ i.split(' ') for i in fp.readlines() ]
    inp = [ (i[0], int(i[1])) for i in inp ]

    x = 0
    d = 0
    for (inst, dist) in inp:
        if inst == 'forward':
            x = x + dist
        elif inst == 'down':
            d = d + dist
        elif inst == 'up':
            d = d - dist
    print(x * d)

    x = 0
    d = 0
    a = 0
    for (inst, dist) in inp:
        if inst == 'forward':
            x = x + dist
            d = d + (dist * a)
        elif inst == 'down':
            a = a + dist
        elif inst == 'up':
            a = a - dist
    print(x * d)