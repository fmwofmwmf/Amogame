function create_tile(w, h) {
    const arr = [];
    const biom = biome(w, h, [1, 2, 3, 4], [1, 1, 1, 1])
    const weights = weightmap(w,h)
    let land = []
    console.log(weightmap(w,h))

    for (let j = 0; j < w; j++) {
        arr[j] = new Array(h)
        for (let i = 0; i < h; i++) {
            const r = Math.random()<weights[j][i] ? 1 : 0
            if (r == 1) land.push([j, i]);
            arr[j][i] = {c:r, b:biom[j][i]}
        }
    }

    land.sort(() => Math.random() - Math.random())
    for (let i = 0; i < 3; i++) {
        arr[land[i][0]][land[i][1]] = new Struc('hosue');
    }
    return new Tile(w, h, [Math.floor(w / 2), Math.floor(h / 2)], arr)
}

function generate_empty_map(w, h) {
    const arr = [];
    for (let j = 0; j < w; j++) {
        arr[j] = new Array(h)
        for (let i = 0; i < h; i++) {
            arr[j][i] = {c:0}
        }
    }
    return arr
}

function generate_tile(count, struct, bime=-1) {
    const s = Math.ceil(Math.sqrt(count)*2)
    const arr = generate_empty_map(s,s);

    if (bime==-1) {
        bime=randint(0,4)
    }
    const b_w = [1,1,1,1]
    b_w[bime] *= 5;
    const biom = biome(s, s, [1, 2, 3, 4], b_w)
    const w = weightmap(s, s, 2)
    const hf = Math.floor(s / 2)
    let land = []

    let i = 1
    let iter = 0
    arr[hf][hf] = {c:1, b:biom[hf][hf]}
    while (i!=count || iter>10000) {
        iter++;
        let x = randint(0,s), y=randint(0,s)
        if (Math.random() < w[x][y] && arr[x][y].c==0) {
            arr[x][y]={c:1, b:biom[x][y]}
            land.push([x,y])
            i++;
        }
    }

    land.sort(() => Math.random() - Math.random())
    for (let i = 0; i < struct; i++) {
        arr[land[i][0]][land[i][1]] = new Struc('House', biom[land[i][0]][land[i][1]]);
    }

    console.log(iter)
    return new Tile(s, s, [Math.floor(s / 2), Math.floor(s / 2)], bime+1, arr)
}

function weightmap(w, h, s=1) {
    const arr = [];
    for (let j = 0; j < w; j++) {
        arr[j] = []
        for (let i = 0; i < h; i++) {
            let d = [j +0.5- w / 2, i +0.5- h / 2];
            arr[j][i] = 1/Math.pow((d[0] * d[0] + d[1] * d[1])/w*2, s);
        }
    }
    return arr
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function create_biome_map(w, h) {
    const arr = [];
    for (let j = 0; j < w; j++) {
        arr[j] = []
        for (let i = 0; i < h; i++) {
            arr[j][i] = 0
        }
    }
    return arr
}

function find_neighbours(x, y, arr) {
    neig = []
    if (x - 1 >= 0) {
        neig.push([x - 1, y])
    }
    if (x + 1 < arr.length) {
        neig.push([x + 1, y])
    }
    if (y - 1 >= 0) {
        neig.push([x, y - 1])
    }
    if (y + 1 < arr[x].length) {
        neig.push([x, y + 1])
    }
    return neig
}

function neighbours_equals(x, y, arr, val) {
    neig = find_neighbours(x, y, arr)
    good = []
    for (let i = 0; i < neig.length; i++) {
        if (arr[neig[i][0]][neig[i][1]] == val) {
            good.push(neig[i])
        }
    }
    return good
}

function create_biome_weight_pairs(options, weights) {
    pairs = []
    for (let i = 0; i < options.length; i++) {
        pairs.push([weights[i], options[i]])
    }
    pairs.sort()
    pairs.reverse()
    return pairs
}

function make_option(x, y, arr, pairs) {
    pairs.reverse()
    high = [0, pairs[0][1]]
    for (let i = 0; i < pairs.length; i++) {
        num = neighbours_equals(x, y, arr, pairs[i][1]).length
        if (num > high[0]) {
            high[0] = num
            high[1] = pairs[i][1]
        }
    }
    return high[1]
}


function biome(w, h, options, weights) {
    let base = create_biome_map(w, h)
    let pairs = create_biome_weight_pairs(options, weights)

    let neighbours = []
    for (let i = 0; i < pairs.length; i++) {
        for (let j = 0; j < pairs[i][0]; j++) {
            randx = randint(0, w)
            randy = randint(0, h)
            base[randx][randy] = pairs[i][1]
            n = neighbours_equals(randx, randy, base, 0)
            for (let k = 0; k < n.length; k++) {
                if (neighbours.indexOf(n[k]) == -1) {
                    neighbours.push(n[k])
                }
            }
        }
    }
    while (neighbours.length > 0) {
        let randi = randint(0, neighbours.length)
        x = neighbours[randi][0]
        y = neighbours[randi][1]
        neighbours.splice(randi, 1)
        base[x][y] = make_option(x, y, base, pairs)
        n = neighbours_equals(x, y, base, 0)
        for (let k = 0; k < n.length; k++) {
            if (neighbours.indexOf(n[k]) == -1) {
                neighbours.push(n[k])
            }
        }
    }

    return base
}