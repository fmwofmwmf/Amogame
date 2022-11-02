const c = document.getElementById('map')
const ctx = c.getContext("2d", {willReadFrequently: true})

const c_to_t = [5, 10, 15, 25, 35, 45, 55, 70, 85, 100]
const tiers = ['C', 'UC', 'R', 'SR', 'SSR', 'SSSR', 'UR', 'UUR', 'Myth']
const names = ['luffy', 'boruto', 'sanji', 'naruto', 'toruto', 'boruto', 'luffy from one piece']
const borders = ['black', 'grey', 'yellow', 'gold', 'red'];
const grades = ['F', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

class Tile {
    constructor(w, h, c, b, data) {
        this.w = w
        this.h = h
        this.center = c;
        this.biome = b;
        this.data = data
        this.data[c[0]][c[1]].c = 2
        this.data[c[0]][c[1]].main = this
        this.contents = {count:[], struct:[]}

        this.name = names[randint(0, names.length)]

        console.log(this, 'Tiledata')

        this.fixH()
        this.fixW()
        
        this.bindStruct()
        this.updateContents()

        this.calcGrade();
    }

    plot(x, y, gridd) {
        let coord = [x-this.center[0], y-this.center[1]];

        if (coord[0]<0 || coord[1]<0) return false;
        let newmap = [];
        for (let i = 0; i < this.w; i++) {
            newmap[i]=[].fill([],0,this.h)

            for (let j = 0; j < this.h; j++) {
                let mape = gridd.map[i+coord[0]][j+coord[1]];
                
                let tie = this.data[i][j];
                if (mape.c!=0 && tie.c!=0) return false;

                newmap[i][j]=tie
            }
        }

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                if (newmap[i][j].c!=0)
                gridd.map[i+coord[0]][j+coord[1]] = newmap[i][j];
            }
        }
        //grid.elements.push(this);
        return true;
    }



    bindStruct() {
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                const e = this.data[i][j];
                if (e.c==3) {
                    e.main = this;
                } 
            }
        }
    }

    updateContents() {
        this.contents['struct'] = []
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                const e = this.data[i][j];
                let cccc = this.contents.count
                if (e.c!=0) {
                    cccc[e.c] = cccc[e.c]? cccc[e.c]+1 : 1 ;
                    cccc[0] = cccc[0]? cccc[0]+1 : 1 ;
                }

                if (e.c == 3) {
                    this.contents['struct'].push(e)
                }
            }
        }
    }

    calcGrade() {
        let g = 0
        for (let i = 0; i < c_to_t.length; i++) {
            if (c_to_t[i]<=this.contents.count[0])
            g = i;
        }
        this.tier = g
        this.stars = (this.contents.count[0]-c_to_t[g])
        console.log(this.stars,'stars')
        this.rank = randint(0,125);
    }

    getIncome() {
        let eco = {
            'wood':this.contents.struct.length,
            'stone':0,
            'energy':0,
            'food':this.contents.count[1]
        }
        return eco
    }

    fixW() {
        const rem = (e) => {
            return e.c == 0;
        }
        if (this.w>1) {
            if (this.data[0].length == this.data[0].filter(rem).length) {
                this.data.shift();
                this.w--;
                this.center[0]--;
                this.fixW()
            }
            
            if (this.data[this.data.length-1].length == this.data[this.data.length-1].filter(rem).length) {
                this.data.pop();
                this.w--;
                this.fixW()
            }
        }
    }

    fixH() {
        if (this.h>1) {
            const check = (ine) => {
                for (let i = 0; i < this.w; i++) {
                    if (!this.data[i][ine].c == 0) {
                        return false
                    }
                }
                return true
            }
            if (check(0)) {
                for (let i = 0; i < this.w; i++) {
                    this.data[i].shift()
                }
                this.h--;
                this.center[1]--;
                this.fixH()
            }
            
            if (check(this.h-1)) {
                for (let i = 0; i < this.w; i++) {
                    this.data[i].pop()
                }
                this.h--;
                this.fixH()
            }
        }
    }

    getNameCard() {
        return `${tiers[this.tier]} ${'✦'.repeat(Math.floor(this.rank/25))} ${this.name}${this.rank%25>4? '+'+this.rank%25 : '+'.repeat(this.rank%25)}
        </br>${'✶'.repeat(Math.floor(this.stars/5))}${'★'.repeat(this.stars%5)}
        </br>${this.contents.count[0]}/${this.w*this.h}`
    }
}

class Struc {
    constructor(e, b) {
        this.c = 3;
        this.b = b;
        this.income = 0;
        this.cards = []
        this.level = 1
        this.grade = randint(0,grades.length)
        this.main = null;
        this.type = e
    }

    getUpgrade() {
        return {
            'wood':(this.level)*2,
            'stone':(this.level),
            'energy':0,
            'food':0
        }
    }

    upgrade() {
        if (this.grade==grades.length-1 && this.level==100)
            return
        if (this.level==100) {
            this.level = 0
            this.grade++;
        } else {
            this.level++;
        }
    }

    getIncome() {

    }

    getInfoCard() {
        return `[${grades[this.grade]}] Lv.${this.level} ${this.type}
        <br> ${biomenames[this.b]}`
    }
}

const colors = ['red', 'lightGreen', 'cornsilk', 'darkSeaGreen', 'LawnGreen']
const biomenames = ['nope', 'plains', 'desert', 'forest', 'green place']
function m_to_c(map, size) {
    c.height = map.length*size;
    c.width = map[0].length*size;

    let grid = {
        'w':map.length,
        'h':map[0].length,
        'size':size,
        'map':map,
        'elements':[],
        'image':ctx.getImageData(0, 0, c.width, c.height)
    }

    grid = re_g(grid)
    return grid
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function re_map() {
    let bad = []
    grid.map = generate_empty_map(grid.w, grid.h)
    for (let i = 0; i < grid.elements.length; i++) {
        const e = grid.elements[i];
        if (!e['tile'].plot(e.x, e.y, grid)) {
            bad.push(e)
        }
    }
    bad.forEach(e => {
        grid.elements.splice(grid.elements.findIndex(el => {
            return el==e
        }))
    });
    return bad
}

function re_g(grid) {
    for (let i = 0; i < grid.w; i++) {
        for (let j = 0; j < grid.h; j++) {
            ctx.beginPath();
            switch (grid.map[i][j].c) {
                case 0:
                    ctx.fillStyle = 'lightGrey'
                    break;
                case 1:
                    ctx.fillStyle = colors[grid.map[i][j].b]
                    break;
                case 2:
                    ctx.fillStyle = 'black'
                    break;
                case 3:
                    ctx.fillStyle = 'grey'
                    break;
            
                default:
                    break;
            }
            ctx.fillRect(grid.size*i, grid.size*j, grid.size, grid.size);
        }
    }
    grid['image']=ctx.getImageData(0, 0, c.width, c.height)
    return grid;
}

function draw_border(shape, x, y) {
    let empty = {c:0}
    let borders = []
    for (let i = 0; i < shape.data.length; i++) {
       for (let j = 0; j < shape.data[i].length; j++) {
          if (shape.data[i][j].c != 0){
             Eborders = [[[i,j],[i+1,j]], [[i+1,j],[i+1,j+1]],[[i,j],[i,j+1]],[[i,j+1],[i+1,j+1]]]
 
             if (j-1>=0){
                if (shape.data[i][j-1].c != 0) {
                   Eborders[0] = null
                }
             }
             if (i+1<shape.data.length) {
                if (shape.data[i+1][j].c != 0) {
                   Eborders[1] = null
                }
             }
             if (i-1>=0) {
                if (shape.data[i-1][j].c != 0){
                   Eborders[2] = null
                }
             }
             if (j+1<shape.data[i].length) {
                if (shape.data[i][j+1].c != 0) {
                   Eborders[3] = null
                }
             }
 
             Eborders.forEach(e => {
                if (e!=null) {
                   borders.push(e)
                }
             });
          }
 
       }
    }
    
    ctx.strokeStyle = 'red';
    borders.forEach(e => {
        ctx.beginPath();
        ctx.moveTo((e[0][0]+x)*grid.size, (e[0][1]+y)*grid.size);
        ctx.lineTo((e[1][0]+x)*grid.size, (e[1][1]+y)*grid.size);
        ctx.stroke();
    });
}

function map(w, h) {
    const arr = new Array(w);
    for (let i = 0; i < w; i++) {
        arr[i] = new Array(h).fill({c:0})
    }
    return arr
}



function draw_outline(shape, x, y) {
    for (let i = 0; i < shape.data.length; i++) {
        for (let j = 0; j < shape.data[i].length; j++) {
            let e = shape.data[i][j]
            ctx.globalAlpha = 0.5;
            switch (e.c) {
                case 1:
                    ctx.fillStyle = colors[e.b]
                    break;
                case 2:
                    ctx.fillStyle = 'black'
                    break;
                case 3:
                    ctx.fillStyle = 'grey'
                    break;
                default:
                    break;
            }

            if (e.c!=0) {
                ctx.fillRect(grid.size*(i+x-shape.center[0]),grid.size*(j+y-shape.center[1]),grid.size, grid.size);
            }
            ctx.globalAlpha = 1.0;
        }
    }
    ctx.strokeStyle = 'white';
    let bb = [[[0,0],[1,0]],[[1,0],[1,1]],[[1,1],[0,1]],[[0,1],[0,0]]]
    bb.forEach(e => {
        ctx.beginPath();
        ctx.moveTo((e[0][0]*shape.w+x-shape.center[0])*grid.size, (e[0][1]*shape.h+y-shape.center[1])*grid.size);
        ctx.lineTo((e[1][0]*shape.w+x-shape.center[0])*grid.size, (e[1][1]*shape.h+y-shape.center[1])*grid.size);
        ctx.stroke();
    })

    draw_border(shape, x-shape.center[0], y-shape.center[1])
    
}

let eco = {
    'wood':0,
    'stone':0,
    'energy':0,
    'food':0
}
function updateRes() {
    let s = ``
    for (const k in eco) {
        s += `${k}: ${eco[k]} `
    }
    resources.innerHTML = s
}

m = map(20,20);
var grid = m_to_c(m, 10)
