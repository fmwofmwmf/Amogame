
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
        this.cards = [new CardHolder(), new CardHolder(), new CardHolder()]

        this.name = names[randint(0, names.length)]

        this.fixH()
        this.fixW()
        
        this.bindStruct()
        this.updateContents()

        this.calcGrade();
        this.global = null;
    }

    plot(x, y, w, h, inp_map) {
        let coord = [x-this.center[0], y-this.center[1]];
        this.global = coord;

        if (coord[0]<0 || coord[1]<0) return false;
        if (!b_sub_b([coord[0], coord[1], coord[0]+this.w, coord[1]+this.h],
            [0, 0, w, h])) return false;
        let newmap = [];
        for (let i = 0; i < this.w; i++) {
            newmap[i]=[].fill([],0,this.h)
            for (let j = 0; j < this.h; j++) {
                let mape = inp_map[i+coord[0]][j+coord[1]];
                
                let tie = this.data[i][j];
                if (mape.c!=0 && tie.c!=0) return false;

                newmap[i][j]=tie
            }
        }

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                if (newmap[i][j].c!=0)
                inp_map[i+coord[0]][j+coord[1]] = newmap[i][j];
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
        this.rank = randint(0,125);
    }

    getIncome() {
        let eco = {
            'wood':this.contents.struct.length,
            'stone':0,
            'energy':0,
            'food':this.contents.count[1]
        }
        this.contents.struct.forEach(e => {
            eco.energy += e.getIncome()
        });
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

    getName() {
        return {
            tier: tiers[this.tier],
            name: this.name,
            stars: `${'✶'.repeat(Math.floor(this.stars/5))}${'★'.repeat(this.stars%5)}`,
            rank: `${Math.floor(this.rank/25)}✦  ${this.rank%25>4? '+'+this.rank%25 : '+'.repeat(this.rank%25)}`,
            ratio: `${this.contents.count[0]}/${this.w*this.h}`,
        }
        
    }

    getCards() {

    }

    draw_border(x, y, s, ctx) {
        const borders = getborders(this.data, e=>{return e.c!=0})
        
        ctx.strokeStyle = 'red';
        borders.forEach(e => {
            ctx.beginPath();
            ctx.moveTo((e[0][0]+x-this.center[0])*s, (e[0][1]+y-this.center[1])*s);
            ctx.lineTo((e[1][0]+x-this.center[0])*s, (e[1][1]+y-this.center[1])*s);
            ctx.stroke();
        });
    }

    draw_preview(x, y, s, ctx) {
        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                let e = this.data[i][j]
                ctx.globalAlpha = 0.7;
                ctx.beginPath();
                switch (e.c) {
                    case 1:
                        ctx.fillStyle = 'pink'
                        ctx.fillRect(s*(i+x-this.center[0]),s*(j+y-this.center[1]), s, s);
                        break;
                    case 2:
                        ctx.fillStyle = 'black'
                        ctx.fillRect(s*(i+x-this.center[0]),s*(j+y-this.center[1]), s, s);
                        break;
                    case 3:
                        ctx.fillStyle = 'blue'
                        ctx.fillRect(s*(i+x-this.center[0]),s*(j+y-this.center[1]),s, s);
                        break;
                    default:
                        break;
                }
    
                if (e.c!=0) {
                    
                }
                ctx.globalAlpha = 1.0;
            }
        }
        ctx.strokeStyle = 'white';
        let bb = [[[0,0],[1,0]],[[1,0],[1,1]],[[1,1],[0,1]],[[0,1],[0,0]]]
        bb.forEach(e => {
            ctx.beginPath();
            ctx.moveTo((e[0][0]*this.w+x-this.center[0])*s, (e[0][1]*this.h+y-this.center[1])*s);
            ctx.lineTo((e[1][0]*this.w+x-this.center[0])*s, (e[1][1]*this.h+y-this.center[1])*s);
            ctx.stroke();
        })
    }

    remove() {
        this.plot = null
    }
}

class Struc {
    /**
     * 
     * @param {string} e type
     * @param {number} b biome
     */
    constructor(e, pos) {
        this.c = 3;
        this.b = b;
        this.cpos = pos
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
        const c = [this.cpos[0]+this.main.global[0]+this.main.center[0],
        this.cpos[1]+this.main.global[1]+this.main.center[1]]

        const out = gen_connect([0, 0, land_grid.w, land_grid.h],
            c, e=>{return biome_grid.map[e[0]][e[1]]==biome_grid.map[c[0]][c[1]] &&
                 land_grid.map[e[0]][e[1]].c!=0})

        return out.length
    }

    getInfoCard() {
        const coord = [this.cpos[0]+
        this.main.global[0]+
        this.main.center[0],
        this.cpos[1]+this.main.global[1]+this.main.center[1]]

        return `[${grades[this.grade]}] Lv.${this.level} ${this.type}
        <br> ${biomenames[biome_grid.map[coord[0]][coord[1]]]}`
    }
}

class Map {
    constructor(w, h, s, e) {
        this.w = w
        this.h = h;
        this.size = s;
        this.empty = e
        this.map = this.gen_empty();
        this.tile_list = []
        this.image = undefined
    }

    gen_empty() {
        const arr = [];
        for (let j = 0; j < this.w; j++) {
            arr[j] = new Array(this.h)
            for (let i = 0; i < this.h; i++) {
                arr[j][i] = JSON.parse(JSON.stringify(this.empty))
            }
        }
        return arr
    }
}

function b_sub_b(a, b) {
    return a[0]>=b[0] && a[1]>=b[1] && a[2]<=b[2] && a[3]<=b[3]
}

function getborders(arr, match) {
    let borders = []
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (match(arr[i][j])){
            const Eborders = [[[i,j],[i+1,j]], [[i+1,j],[i+1,j+1]],[[i,j],[i,j+1]],[[i,j+1],[i+1,j+1]]]
                if (j-1>=0){
                if (arr[i][j-1].c != 0) {
                    Eborders[0] = null
                }
                }
                if (i+1<arr.length) {
                if (arr[i+1][j].c != 0) {
                    Eborders[1] = null
                }
                }
                if (i-1>=0) {
                if (arr[i-1][j].c != 0){
                    Eborders[2] = null
                }
                }
                if (j+1<arr[i].length) {
                if (arr[i][j+1].c != 0) {
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
    return borders
}

const colors = ['lightGrey', 'lightGreen', 'cornsilk', 'darkSeaGreen', 'LawnGreen']
const biomenames = ['nope', 'plains', 'desert', 'forest', 'green place']

/**
 * Renders canvas, returns imagedata
 * @param {grid} grid
 *  
 * @returns {ImageData}
 */
function render_grid(size, arr, cnx, col=colors) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            cnx.beginPath();
            const s = size, x = s*i, y = s*j
            switch (arr[i][j].c) {
                case 0:
                    cnx.fillStyle = col[0]
                    cnx.fillRect(x, y, s, s);
                    break;
                case 1:
                    cnx.fillStyle = col[1]
                    cnx.fillRect(x, y, s, s);
                    break;
                case 2:
                    cnx.fillStyle = 'black'
                    cnx.fillRect(x, y, s, s);
                    break;
                case 3:
                    cnx.fillStyle = col[1]
                    cnx.fillRect(x, y, s, s);
                    cnx.fillStyle = 'grey'
                    cnx.arc(x+s/2, y+s/2, s/3, 0, 2 * Math.PI, false);
                    cnx.fill()
                    break;
                default:
                    break;
            }
            
        }
    }
}

const resources = document.getElementById('money')

let eco = {
    'wood':0,
    'stone':0,
    'energy':0,
    'food':0,
}

function updateRes() {
    let s = ``
    for (const k in eco) {
        s += `${k}: ${eco[k]} `
    }
    resources.innerHTML = s
}
updateRes()

m = generate_empty_map(30, 20);

//var grid = map_to_grid(m, 10)