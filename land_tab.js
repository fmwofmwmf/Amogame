
var inv = []

for (let i = 0; i < 1; i++) {
    b = randint(5,100)
    inv[i] = generate_tile(b, Math.ceil(Math.sqrt(b)/3))
    
}
var invHTML = []
var selected = -1

class Land extends Map {
    constructor(w,h,s,canv) {
        super(w, h, s, {c:0});
        this.m = [-1,-1]
        this.c = canv;
        this.selected = [-1,-1]
        this.ctx = this.c.getContext("2d", {willReadFrequently: true})
        this.refresh()
        this.events()   
    }

    add(x1, y1, e) {
        let bad = false
        this.map = this.gen_empty();
        this.tile_list.push({x:x1, y:y1, tile:e})

        for (let i = 0; i < this.tile_list.length; i++) {
            const e = this.tile_list[i];
            console.log(e)
            if (!e.tile.plot(e.x, e.y, this.w, this.h, this.map)) {
                bad = true
            }
        }
        if (bad) {
            this.tile_list.pop()
        }
        console.log(this)
        if (!bad) {
            this.refresh()
        }
        return bad
    }

    rem(e) {
        const a = this.tile_list.findIndex(el=>{return el.tile==e})
        this.tile_list.splice(a,1)
        console.log(this.tile_list, 'tiles')
        
        this.refresh()
    }

    get_income() {
        let out = {}
        land_grid.tile_list.forEach(t => {
            const g = t.tile.getIncome()
            for (const k in g) {
                out[k] = out[k] + g[k] || g[k]
            }
        }
        )
        return out
    }

    refresh() {
        this.c.width = this.w*this.size;
        this.c.height = this.h*this.size;

        this.map = this.gen_empty()
        this.tile_list.forEach(t => {
            t.tile.plot(t.x, t.y, this.w, this.h, this.map)
        });
        this.render()
    }

    render() {
        let s = []
        this.ctx.clearRect(0, 0, this.c.width, this.c.height)
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                this.ctx.beginPath();
                const x = this.size*i, y = this.size*j
                switch (this.map[i][j].c) {
                    case 0:
                        this.ctx.globalAlpha = 0.5
                        this.ctx.fillStyle = 'grey'
                        this.ctx.fillRect(x, y, this.size, this.size);
                        this.ctx.globalAlpha = 1
                        break;
                    case 1:
                        break;
                    case 2:
                        this.ctx.beginPath()
                        this.ctx.fillStyle = 'red'
                        this.ctx.arc(x+this.size/2, y+this.size/2, this.size/3,
                        0, 2 * Math.PI, false);
                        this.ctx.fill()
                        break;
                    case 3:
                        this.ctx.beginPath()
                        this.ctx.fillStyle = 'grey'
                        this.ctx.arc(x+this.size/2, y+this.size/2, this.size/3,
                        0, 2 * Math.PI, false);
                        this.ctx.fill()
                        break;
                    default:
                        this.ctx.fillStyle = 'rgba(0,0,0,0)'
                        break;
                }              
            }
        }
        const border = getborders(this.map, e=>{
            return e.c!=0
        })
        this.ctx.strokeStyle = 'brown';

        border.forEach(e => {
            this.ctx.beginPath();
            this.ctx.moveTo(e[0][0]*this.size, e[0][1]*this.size);
            this.ctx.lineTo(e[1][0]*this.size, e[1][1]*this.size);
            this.ctx.stroke();
        });
        this.image = this.ctx.getImageData(0, 0, this.c.width, this.c.height)
    }

    user_overlay(w, h) {
        this.ctx.putImageData(this.image, 0, 0);
        this.ctx.beginPath();
        if (this.selected[0] != -1) {
            this.ctx.strokeStyle = 'red'
            this.ctx.rect(this.selected[0]*this.size, this.selected[1]*this.size, this.size, this.size);
        } else if (w == -1){
            this.ctx.stroke();
            this.m[0] = w;
            this.m[1] = h;
            return;
        } else {
            this.ctx.strokeStyle = 'green'
            this.ctx.rect(w*this.size, h*this.size, this.size, this.size);
        }

        this.ctx.stroke();
        this.m[0] = w;
        this.m[1] = h;
        
        if (inv[selected] && selected>=0) {
            inv[selected].draw_preview(w, h, this.size, this.ctx);
        } else if (this.selected[0] == -1) {
            add_struct_info(this.map[w][h], [w,h], true)
        }  else {
            add_struct_info(this.map[this.selected[0]][this.selected[1]], this.selected, true)
        }
    }

    events() {
        this.c.addEventListener('mouseleave', e=>{
            this.user_overlay(-1, -1)
        })

        this.c.addEventListener('mousemove', e=>{
            const cb = this.c.getBoundingClientRect()
            const w = Math.floor((e.clientX-cb.left)/this.size)
            const h = Math.floor((e.clientY-cb.top)/this.size)
            if ((w!=this.m[0] || h!=this.m[1]) && w>-1 && h>-1) {
                this.user_overlay(w, h)
            }
        })

        this.c.addEventListener('click', e => {
            if (inv[selected]) {
                if (selected>=0) {
                    const a = inv.findIndex(e=>{return e==inv[selected]})
                    if (!this.add(this.m[0], this.m[1], inv[a])) {
                        inv.splice(a, 1)
                        selected = -1
                        display_inv()
                    }
                    
                }
            } else {
                if (this.selected[0]==this.m[0] && this.selected[1]==this.m[1]) {
                    this.selected = [-1, -1]
                } else {
                    this.selected = [this.m[0], this.m[1]]
                    add_struct_info(this.map[this.m[0]][this.m[1]], [this.m[0], this.m[1]])
                    this.user_overlay(this.m[0], this.m[1])
                }
                
            }
        })

        this.c.addEventListener('dblclick', e=>{
            if (this.map[this.m[0]][this.m[1]].c == 2) {
                this.map[this.m[0]][this.m[1]].main.rem(Tileinfo)
            }
        })
    }
}

/**
 * 
 * @param {Tile} shape Tile to display info of
 */
function displayTileInfo(shape, node, rem=false) {
    node.innerHTML = ''
    const info = shape.getName()

    const tier = document.createElement('div')
    tier.className = 'tile-info-tier'
    tier.innerHTML = info.tier

    const name = document.createElement('div')
    name.className = 'tile-info-name'
    name.innerHTML = info.name
    name.style.fontSize = `${Math.min(180/info.name.length, 20)}px`

    const stars = document.createElement('div')
    stars.className = 'tile-info-stars'
    stars.innerHTML = info.stars


    const body = document.createElement('div')
    body.className = 'tile-info-body'
    const body1 = tile_to_canvas(100, 100, shape)
    body1.className = 'tile-info-body-prev'
    const body2 = document.createElement('div')
    body2.className = 'tile-info-body-img'

    body2.innerHTML = `<br>anime girl picture<br>anime girl picture`
    body2.style.display = 'none';
    
    const change = document.createElement('span')
    change.innerHTML = 'S'
    let y = 0
    change.addEventListener('click', e=>{
        if (y==0) {
            y=1;
            body1.style.display = 'none';
            body2.style.display = 'block';
        } else if (y==1) {
            y=0;
            body1.style.display = 'block';
            body2.style.display = 'none';
        }
    })
    change.className = 'tile-info-switch'
    
    body.appendChild(body1)
    body.appendChild(body2)

    const other = document.createElement('div')
    other.className = 'tile-info-other'
    other.innerHTML = `${info.rank} ${info.ratio}`

    const cards = document.createElement('div')
    cards.className = 'tile-info-cards'

    shape.cards.forEach(c => {
        cards.appendChild(c.display())
    });

    node.appendChild(body)
    node.appendChild(change)
    node.appendChild(name)
    node.appendChild(stars)
    node.appendChild(tier)
    node.appendChild(other)
    node.appendChild(cards)

    node.style.borderColor = colors[shape.biome];
    //if center add remove button
    if (rem) {
        if (land_grid.tile_list.find(e=>{return e.tile==shape})) {
            let r = document.createElement('button')
            r.innerHTML = '<center>✕</center>'
            r.classList = 'tile-info-remove'
            r.addEventListener('click', e=>{
                shape.rem(node)
            })
            node.appendChild(r)
        }
    }
}

function tile_to_canvas(x, y, shape) {
    const s = Math.min(x/shape.w, y/shape.h)
    const can = document.createElement('canvas')
    const cx = can.getContext('2d')
    can.width = s*shape.w
    can.height = s*shape.h
    const newcol = ['rgba(0,0,0,0)', 'purple', 'purple', 'purple', 'purple']
    render_grid(s, shape.data, cx, newcol)

    return can
}

function cycle_button() {

}

/**
 * Displays info about a grid element
 * @param {Struc}   element Struc to display
 * @param {boolean} draw    draw highlight of the shape
 */
function add_struct_info(element, pos, draw=false) {
    StructInfo.innerHTML = `(${pos[0]+1}, ${pos[1]+1})<br>`
    switch (element.c) {
        case 1:
            StructInfo.innerHTML += biomenames[biome_grid.map[pos[0]][pos[1]]]
            break;
        case 2:
            if (draw) {
                element.main.draw_border(pos[0], pos[1], land_grid.size, land_grid.ctx)
            }
            displayTileInfo(element.main, TileInfo, true);
            StructInfo.innerHTML += `Center
            <br>${biomenames[biome_grid.map[pos[0]][pos[1]]]}`
            break;
        case 3:
            StructInfo.innerHTML += element.getInfoCard()
            const up = document.createElement('button')
            up.innerHTML = 'upgrade'
            up.addEventListener('click', e=>{
                element.upgrade();
                add_struct_info(element, pos)
            })
            StructInfo.innerHTML += '<br>'
            StructInfo.appendChild(up)
            break;
        default:
            StructInfo.innerHTML += 'Nothing'
            break;
    }
}

const land_grid = new Land(30, 20, 10, document.getElementById('land'))
