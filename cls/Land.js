class Land extends Map {

    m = [-1,-1];
    selected = [-1,-1];
    tile_list = [];
    tick = null;

    constructor(w, h, s, canvas) {
        super(w, h, s, {c:0}, canvas);
        this.refresh();
        this.events();
        this.start_tick();
    }

    start_tick() {
        this.tick = setInterval(() => {
            this.tile_list.forEach(t => {
                t.tile.time(1);
            });
        }, 500);
    }

    end_tick() {
        clearInterval(this.tick);
        this.tick = null;
    }

    add_tile(x, y, tile) {
        let bad = false;
        this.map = this.gen_empty();
        this.tile_list.push({x:x, y:y, tile:tile});

        for (let i = 0; i < this.tile_list.length; i++) {
            const e = this.tile_list[i];
            console.log(e, 'added');
            if (!e.tile.plot(e.x, e.y, this.w, this.h, this.map)) {
                bad = true
            } else {
                e.tile.area = this;
            }
        }
        if (bad) {
            this.tile_list.pop()
        }
        if (!bad) {
            this.refresh()
        }
        return bad
    }

    set remove_tile(tile) {
        const a = this.tile_list.findIndex(el=>{return el.tile==tile})
        this.tile_list.splice(a,1)        
        this.refresh()
        this.selected = [-1,-1];
    }

    get_income() {
        let out = {}
        this.tile_list.forEach(t => {
            const g = t.tile.getIncome()
            for (const k in g) {
                out[k] = out[k] + g[k] || g[k]
            }
        }
        )
        return out
    }

    render() {
        this.map = this.gen_empty()
        this.tile_list.forEach(t => {
            t.tile.plot(t.x, t.y, this.w, this.h, this.map)
        });
        
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
        
        if (inv.tiles[inv.s_tile] && inv.s_tile>=0) {
            inv.tiles[inv.s_tile].draw_preview(w, h, this.size, this.ctx);
        } else if (this.selected[0] == -1) {
            add_struct_info(this.map[w][h], [w,h], this, true)
        }  else {
            add_struct_info(this.map[this.selected[0]][this.selected[1]], this.selected, this, true)
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
            if ((w!=this.m[0] || h!=this.m[1]) && w>-1 && h>-1 && this.selected[0]==-1) {
                this.user_overlay(w, h)
            }
            this.m[0] = w;
            this.m[1] = h;
        })

        this.c.addEventListener('click', e => {
            if (inv.tiles[inv.s_tile]) {
                if (inv.s_tile>=0) {
                    const a = inv.tiles.findIndex(e=>{return e==inv.tiles[inv.s_tile]})
                    if (!this.add_tile(this.m[0], this.m[1], inv.tiles[a])) {
                        inv.rem_tile = inv.tiles[a]
                        inv.s_tile = -1
                    }
                    
                }
            } else {
                if (this.selected[0]==this.m[0] && this.selected[1]==this.m[1]) {
                    this.selected = [-1, -1]
                } else {
                    this.selected = [this.m[0], this.m[1]]
                    add_struct_info(this.map[this.m[0]][this.m[1]], [this.m[0], this.m[1]], this)
                }
                this.user_overlay(this.m[0], this.m[1])
            }
        })

        this.c.addEventListener('dblclick', e=>{
            if (this.map[this.m[0]][this.m[1]].c == 2) {
                this.map[this.m[0]][this.m[1]].main.remove = TileInfo
            }
        })
    }
}

var current_tile = null

/**
 * 
 * @param {Tile} shape Tile to display info of
 */
function displayTileInfo(shape, node) {
    current_tile = shape
    node.innerHTML = ''
    node.appendChild(shape.getInfoCard())
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


var current_struc = null
const StructInfo = document.getElementById('struct-info')
const CanvasInfo = document.getElementById('canvas-info')

/**
 * Displays info about a grid element
 * @param {Struc}   element Struc to display
 * @param {boolean} draw    draw highlight of the shape
 */
function add_struct_info(element, pos, area, draw=false) {
    StructInfo.innerHTML = `(${pos[0]+1}, ${pos[1]+1})<br>`
    current_struc = null
    pathinfo.innerHTML = ''
    switch (element.c) {
        case 1:
            StructInfo.innerHTML += biomenames[area.biome_map.map[pos[0]][pos[1]]]
            break;
        case 2:
            display_navbar.switch_tab(0)
            if (draw) {
                element.main.draw_border(pos[0], pos[1], area.size, area.ctx)
            }
            displayTileInfo(element.main, TileInfo);
            StructInfo.innerHTML += `Center
            <br>${biomenames[area.biome_map.map[pos[0]][pos[1]]]}`
            break;
        case 3:
            current_struc = element
            display_navbar.switch_tab(1)
            StructInfo.innerHTML = `(${pos[0]+1}, ${pos[1]+1}) ${biomenames[area.biome_map.map[pos[0]][pos[1]]]}`
            StructInfo.appendChild(element.getInfoCard())
            pathinfo.appendChild(element.getPathCard())
            break;
        default:
            StructInfo.innerHTML += 'Nothing'
            break;
    }
}



