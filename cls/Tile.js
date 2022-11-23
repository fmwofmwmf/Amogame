class Tile {
    constructor(w, h, c, b, data, n=names) {
        this.w = w
        this.h = h
        this.center = c;
        this.biome = b;
        this.data = data
        this.data[c[0]][c[1]].c = 2
        this.data[c[0]][c[1]].main = this
        this.contents = {count:[], struct:[]}
        this.cards = [new CardHolder(this, ['mod-t', 'branch']), new CardHolder(this, ['mod-t', 'branch']), new CardHolder(this, ['mod-t', 'branch'])]

        this.name = n[randint(0, n.length)]
        this.area = null;

        this.fixH()
        this.fixW()
        
        
        this.updateContents();

        this.calcGrade();
        this.bindStruct();
        this.global = null;

        this.progresses = []
        this.ticks = 0
        this.maxticks = 10
    }

    time(t) {
        this.ticks+=t;
        if (this.ticks>=this.maxticks) {
            this.ticks = 0
            addeco(this.getIncome())
        }
        this.progresses.forEach(p => {
            p.value = this.ticks
        });
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

    rem(area, e) {
        current_tile = null
        area.rem(this)
        inv.push(this)
        display_inv()
        this.area=null;
        area.refresh()
        e.innerHTML = 'Nothing'
        e.style.borderColor = 'red'
    }

    bindStruct() {
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                const e = this.data[i][j];
                if (e.c==3) {
                    e.bindMain(this)
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
        console.log(this, this.contents, this.tier)
    }

    getIncome() {
        let eco = {
            'wood':this.contents.struct.length,
            'stone':0,
            'energy':0,
            'food':this.contents.count[1]
        }
        this.contents.struct.forEach(s => {
            const out = s.getIncome()
            for (const k in out) {
                eco[k] += out[k]
            }
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
            ratio: `${this.contents.count[0]}/(${this.w}×${this.h})`,
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

function b_sub_b(a, b) {
    return a[0]>=b[0] && a[1]>=b[1] && a[2]<=b[2] && a[3]<=b[3]
}

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