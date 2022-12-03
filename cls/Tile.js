class Tile {
    constructor(w, h, c, b, data, n=names) {
        this.w = w
        this.h = h
        this.center = c;
        this.biome = b;
        this.data = data
        this.city = this.data[c[0]][c[1]]
        this.city.c = 2
        this.city.main = this
        this.city.base_stats = {max_paths:3};
        
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

        this.ticks = 0
        this.maxticks = 2
        
        this.maxRes = {
            energy:[1000],
            food:[1000],
        }
        this.inv = Object.create(eco)
        this.inv.res = Object.create(eco.res)

        this.makeInfoCard()
    }

    time(t) {
        this.ticks+=t;
        if (this.ticks>=this.maxticks) {
            this.ticks = 0
            eco.add = this.getIncome()
        }
        this.progress.value = this.ticks
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

    set remove(display) {
        current_tile = null
        console.log('i')
        this.area.remove_tile = this
        inv.add_tile = this
        this.contents.struct.forEach(s => {
            for (let i = s.paths.length-1; i > -1; i--) {
                this.area.path_map.remove = s.paths[i]
            }
        });
        this.area.render()
        this.area=null;
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
        //console.log(this, this.contents, this.tier)
    }

    efficency() {
        let ef = 1
        if (this.inv.res.food==0 && this.maxRes.food!=0) {
            ef*=0.7
        }
        if (this.inv.res.energy==0 && this.maxRes.energy!=0) {
            ef*=0.7
        }
        return ef
    }

    maxIncome() {
        let out = {}
        for (const r in this.maxRes) {
            if (this.inv.res[r]>this.maxRes[r][0]) {
                out[r] = this.inv.res[r]-this.maxRes[r][0]
                this.inv.res[r]=this.maxRes[r][0]
            }
            this.maxRes[r][1].value = this.inv.res[r]
        }
        return out
    }

    getIncome() {
        this.contents.struct.forEach(s => {
            s.income_stage_1()
        });
        this.contents.struct.forEach(s => {
            s.income_stage_2()
        });
        this.contents.struct.forEach(s => {
            this.inv.add = s.income_stage_3()
        });
        return this.maxIncome()
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

    makeInfoCard() {
        this.info = document.createElement('div')
        this.info.className = 'tile-info'

        this.tierHTML = document.createElement('div')
        this.tierHTML.className = 'tile-info-tier'

        this.nameHTML = document.createElement('div')
        this.nameHTML.className = 'tile-info-name'

        this.stars = document.createElement('div')
        this.stars.className = 'tile-info-stars'

        this.body = document.createElement('div')
        this.body.className = 'tile-info-body'

        this.body1 = document.createElement('div')
        this.body1.className = 'tile-info-body-prev'

        this.body2 = document.createElement('div')
        this.body2.className = 'tile-info-body-img'
        this.body2.style.display = 'none'

        this.body.appendChild(this.body1)
        this.body.appendChild(this.body2)

        this.change = document.createElement('span')
        this.change.innerHTML = 'S'
    
        let y = 0
        this.change.addEventListener('click', e=>{
            if (y==0) {
                y=1;
                this.body1.style.display = 'none';
                this.body2.style.display = 'block';
            } else if (y==1) {
                y=0;
                this.body1.style.display = 'block';
                this.body2.style.display = 'none';
            }
        })
        this.change.className = 'tile-info-switch'

        this.other = document.createElement('div')
        this.other.className = 'tile-info-other'

        this.cardlist = document.createElement('div')
        this.cardlist.className = 'tile-info-cards'

        this.cards.forEach(c => {
            this.cardlist.appendChild(c.display())
        });

        this.progressdiv = document.createElement('div')
        this.progressdiv.className = 'tile-info-progress'

        this.progress = document.createElement('progress')
        this.progress.className = 'tile-progress'
        this.progressdiv.appendChild(this.progress)

        this.r = document.createElement('button')
        this.r.innerHTML = '<center>✕</center>'
        this.r.classList = 'tile-info-remove'

        this.r.addEventListener('click', e=>{
            this.remove = this.info
        })
        
        for (const r in this.maxRes) {
            const p = document.createElement('progress')
            p.className = 'tile-progress'
            this.maxRes[r][1] = p;
            p.value=0
            p.max=this.maxRes[r][0]
            this.progressdiv.appendChild(p)
            new Tooltip(p).addVar(()=>`${this.inv.res[r]}/${this.maxRes[r][0]}`)
        }

        this.info.appendChild(this.tierHTML)
        this.info.appendChild(this.nameHTML)
        this.info.appendChild(this.stars)
        this.info.appendChild(this.body)
        this.info.appendChild(this.change)
        this.info.appendChild(this.other)
        this.info.appendChild(this.cardlist)
        this.info.appendChild(this.progressdiv)
        this.info.appendChild(this.r)

        
    }

    getInfoCard() {
        const info = this.getName()

        this.tierHTML.innerHTML = info.tier

        this.nameHTML.innerHTML = info.name
        this.nameHTML.style.fontSize = `${Math.min(180/info.name.length, 20)}px`

        this.stars.innerHTML = info.stars

        this.body1.innerHTML = ''
        this.body1.appendChild(tile_to_canvas(100, 100, this))

        this.body2.innerHTML = `<br>anime girl picture<br>anime girl picture`

        this.other.innerHTML = `${info.rank} ${info.ratio}`

        this.cards.forEach(c => {
            c.display()
        });

        this.progress.value = 0
        this.progress.max = this.maxticks

        this.info.style.borderColor = colors[this.biome];
        //if center add remove button
        if (this.area) {
            this.r.style.display = 'block'
        } else {
            this.r.style.display = 'none'
        }
        return this.info
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