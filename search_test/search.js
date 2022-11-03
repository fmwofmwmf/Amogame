const c = document.getElementById('canva')
const ctx = c.getContext("2d", {willReadFrequently: true})

function gen(w, h, c) {
a = new Array(w)
    for (let i = 0; i < a.length; i++) {
       a[i] = new Array(h).fill(c)    
    }
    return a;
}

var arr = gen(10, 10, 0)
cols = ['white', 'lightGreen', 'darkSeaGreen', 'cornsilk']

function fillC(row) {
    arr[row] = new Array(arr.length).fill(1)
}

function fillR(col) {
    for (let i = 0; i < arr[col].length; i++) {
        arr[i][col] = 1
    }
}

function colore(ar) {
    for (let i = 0; i < ar.length; i++) {
        arr[ar[i][0]][ar[i][1]] = 2
    }
}

const eucl = (x, y, d) => {return Math.sqrt(x*x + y*y) < d}
const cart = (x, y, d) => {return Math.abs(x)+Math.abs(y) < d}
const poly = (x, y, d) => {return Math.max(Math.abs(x), Math.abs(y)) < d}
const eucld = (e1, e2) => {return Math.sqrt(Math.pow(e1[0]-e2[0],2)+Math.pow(e1[1]-e2[1],2))}
fillR(3)
fillR(4)
fillR(6)

fillC(4)
fillC(5)

let r = gen_connect([0,0,10,10], [5,4], e=>{return arr[e[0]][e[1]]==1})
colore(r)

s = 50
c.width = 500
c.height = 500

for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
        ctx.fillStyle = cols[arr[i][j]]
        ctx.fillRect(i*s,j*s,s,s)
    }   
}

for (let i = 0; i < arr.length+1; i++) {
    ctx.strokeStyle = 'black'
    ctx.beginPath();
    ctx.moveTo(i*s, 0);
    ctx.lineTo(i*s, 500);
    ctx.stroke();
}

for (let i = 0; i < arr.length+1; i++) {
    ctx.strokeStyle = 'black'
    ctx.beginPath();
    ctx.moveTo(0, i*s);
    ctx.lineTo(500, i*s);
    ctx.stroke();
}

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max)
}

function val(x, y, b) {
    return x>=b[0] && x<b[2] && y>=b[1] && y<b[3]
}

function gen_connect(bounds, start, eq_c) {
    const nx = [0,0,1,-1]
    const ny = [1,-1,0,0]
    let out = []
    let not_cool = []
    let q = [start]
    let count = 0
    
    while (count<1000 && q.length>0) {
        if (eq_c(q[0])) {
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

function gen_connect_coord(bounds, start, eq_c) {
    const nx = [0,0,1,-1]
    const ny = [1,-1,0,0]
    let out = []
    let not_cool = []
    let q = [[start, [0,0]]]
    let count = 0
    
    while (count<1000 && q.length>0) {
        if (eq_c(q[0][0])) {
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

function closest(gr, start, eq_o) {
    dist = [10000, []]
    for (let i = 0; i < gr.length; i++) {
        for (let j = 0; j < gr[i].length; j++) {
            if (eq_o(gr[i][j])) {
                d = Math.max(Math.abs(i-start[0]), Math.abs(j-start[1]))
                console.log(i,j,'lk',d, dist)
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

function gen_survey(gr, eq_c) {
    out = []
    for (let i = 0; i < gr.length; i++) {
        for (let j = 0; j < gr[i].length; j++) {
            if (eq_c([i, j])) {
                out.push([i, j])
            }
        }
    }
    return out
}

function ordering(inp, eq, sort) {
    out = []
    for (let i = 0; i < inp.length; i++) {
        out.push([eq(inp[i]), inp[i]])
    }
    return out.sort(sort)
}

function fit(inp, eq, clean) {
    let out = []
    for (let i = 0; i < inp.length; i++) {
        if (eq(inp[i])) {
            out.push(clean(inp[i]))
        }
    }
    return out
}