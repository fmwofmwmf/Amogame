/**
 * Creates a 2D array with empty Obj
 * @param {number} w width
 * @param {number} h height
 * 
 * @returns {any[][]} 2D array filled with {c:0}
 */
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

/**
 * Generates a Tile
 * @param {number} count    land count
 * @param {number} struct   structure count
 * @param {number} bime     main biome
 * 
 * @returns {Tile}
 */
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
        arr[land[i][0]][land[i][1]] = new Struc('Windmill', biom[land[i][0]][land[i][1]]);
    }

    console.log(iter)
    return new Tile(s, s, [Math.floor(s / 2), Math.floor(s / 2)], bime+1, arr)
}

/**
 * Generates a 2D array with circular weightmap
 * @param {number} w width
 * @param {number} h height
 * @param {number} s tendency to center
 * @returns 
 */
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

/**
 * 
 * @param {number} min minimum
 * @param {number} max maximum
 * @returns {number}
 */
function randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Nice function haha
 * @param {*} w width
 * @param {*} h height
 * 
 * @returns {number[][]} 2D array filled with 0
 */
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

/**
 * Returns up to 4 valid neighbors
 * @param {number}   x   x
 * @param {number}   y   y
 * @param {any[][]}  arr some 2D array
 * 
 * @returns {number[][]} array of valid coords
 */
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

/**
 * Returns neighbors that equal val
 * @param {number}  x   start x
 * @param {number}  y   start y
 * @param {any[][]} arr array to test
 * @param {any}     val value to test for
 * 
 * @returns {any[]} 
 */
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

/**
 * 
 * @param {number[]} options array of biome values
 * @param {number[]} weights array of biome seed counts
 * 
 * @returns {number[][]} [[weight, biome], ...]
 */
function create_biome_weight_pairs(options, weights) {
    pairs = []
    for (let i = 0; i < options.length; i++) {
        pairs.push([weights[i], options[i]])
    }
    pairs.sort()
    pairs.reverse()
    return pairs
}

/**
 * idk
 * @param {*} x 
 * @param {*} y 
 * @param {*} arr 
 * @param {*} pairs 
 * @returns 
 */
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

/**
 * idk
 * @param {number} w width
 * @param {number} h height
 * @param {*} options 
 * @param {*} weights 
 * 
 * @returns {number[][]} 2D array filled with biome numbers
 */
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