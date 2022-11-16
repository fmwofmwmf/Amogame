function randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 
 * @param {number}  v 
 * @param {number}  min 
 * @param {number}  max 
 * 
 * @returns {number}
 */
function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max)
}

/**
 * Check if valid
 * @param {number}      x 
 * @param {number}      y 
 * @param {number[]}    b [x1, y1, x2, y2]
 * 
 * @returns {boolean}
 */
function val(x, y, b) {
    return x>=b[0] && x<b[2] && y>=b[1] && y<b[3]
}

/**
 * 
 * @param {number[]}   bounds   [x1, y1, x2, y2]
 * @param {number[]}   start    [x, y]
 * @param {Function}   q        function([x, y]) -> boolean
 * 
 * @returns {number[][]} [[x, y], ...]
 */
function gen_connect(bounds, start, eq) {
    const nx = [0,0,1,-1]
    const ny = [1,-1,0,0]
    let out = []
    let not_cool = []
    let q = [start]
    let count = 0
    
    while (count<1000 && q.length>0) {
        if (eq(q[0])) {
            for (let i = 0; i < 4; i++) {
                e = [q[0][0]+nx[i], q[0][1]+ny[i]]
                const thesame = (el) => {return el[0]==e[0] && el[1]==e[1]}
                if (val(e[0], e[1], bounds)
                && !out.some(thesame)
                && !not_cool.some(thesame)
                && !q.some(thesame)) {
                    q.push(e)
                }
            }
            out.push(q[0])
        } else {
            not_cool.push(q[0])
        }
        q.shift();
        count++;
    }
    return out
}

/**
 * 
 * @param {number[]}   bounds   [x1, y1, x2, y2]
 * @param {number[]}   start    [x, y]
 * @param {Function}   eq       function([x, y]) -> bool
 * 
 * @returns {number[][][]} [[[dx, dy], [x, y]], ...]
 */
function gen_connect_coord(bounds, start, eq) {
    const nx = [0,0,1,-1]
    const ny = [1,-1,0,0]
    let out = []
    let not_cool = []
    let q = [[start, [0,0]]]
    let count = 0
    
    while (count<1000 && q.length>0) {
        if (eq(q[0][0])) {
          for (let i = 0; i < 4; i++) {
                e = [[q[0][0][0]+nx[i], q[0][0][1]+ny[i]],
                    [q[0][1][0]+nx[i], q[0][1][1]+ny[i]]]
                const thesame = (el) => {return el[0][0]==e[0][0] && el[0][1]==e[0][1]}
                if (val(e[0][0], e[0][1], bounds)
                && !out.some(thesame)
                && !not_cool.some(thesame)
                && !q.some(thesame)) {
                    q.push(e)
                }
            }
            out.push(q[0])
        } else {
            not_cool.push(q[0])
        }
        q.shift();
        count++;
    }
    return out
}

/**
 * returns a list of closest elements
 * @param {any[][]}     gr      grid
 * @param {number[]}    start   [x, y]
 * @param {Function}    eq      function(Any) -> bool
 * 
 * @returns {number[][]} [[x, y], ...]
 */
function closest(gr, start, eq) {
    dist = [10000, []]
    for (let i = 0; i < gr.length; i++) {
        for (let j = 0; j < gr[i].length; j++) {
            if (eq(gr[i][j])) {
                d = Math.max(Math.abs(i-start[0]), Math.abs(j-start[1]))
                if (d<dist[0]) {
                    dist[1]=[[i,j]]
                    dist[0] = d
                } else if (d==dist[0]) {
                    dist[1].push([i,j])
                }
            }
        }
    }
    return dist[1]
}

/**
 * 
 * @param {any[]}       start   [x, y]
 * @param {Function}    eq      function()
 * @param {Function}    dist    function([x, y], Any) -> number
 * @param {Function}    sortf   function(a, b) -> number
 * 
 * @returns {any[][]} [[distance, any], ...]
 */
function dist_list(start, eq, dist, sortf=null) {
    const r = gen_survey(start, eq)
    let out = []
    for (let i = 0; i < r.length; i++) {
        const e = r[i];
        out.push([dist(start, e), e])
    }
    if (sortf) {
        out.sort(sortf)
    }
    return out
}

/**
 * 
 * @param {any[][]}     gr grid
 * @param {Function}    eq function([x, y]) -> boolean
 * 
 * @returns {number[][]} [[x, y], ...]
 */
function gen_survey(gr, eq) {
    out = []
    for (let i = 0; i < gr.length; i++) {
        for (let j = 0; j < gr[i].length; j++) {
            if (eq([i, j])) {
                out.push([i, j])
            }
        }
    }
    return out
}

/**
 * 
 * @param {any[]}    inp    list to be ordered
 * @param {Function} eq     function(any) -> boolean
 * @param {Function} sort   function(a, b) -> number
 * 
 * @returns {any[][]} [[order, any], ...]
 */
function ordering(inp, eq, sort) {
    out = []
    for (let i = 0; i < inp.length; i++) {
        out.push([eq(inp[i]), inp[i]])
    }
    return out.sort(sort)
}

/**
 * 
 * @param {any[]}    inp    list to be ordered
 * @param {Function} eq     function(any) -> boolean
 * @param {Function} clean  function(any) -> any
 * 
 * @returns {any[]}
 */
function fit(inp, eq, clean) {
    let out = []
    for (let i = 0; i < inp.length; i++) {
        if (eq(inp[i])) {
            out.push(clean(inp[i]))
        }
    }
    return out
}