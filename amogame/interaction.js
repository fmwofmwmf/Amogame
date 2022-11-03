const nextday = document.getElementById('day')

const TileInfo = document.getElementById('Tileinfo')
const StructInfo = document.getElementById('Structinfo')
const resources = document.getElementById('money')

nextday.addEventListener('click', (e) => {
    grid.elements.forEach(ele => {
        const g = ele.getIncome()
        for (const k in g) {
            eco[k] += g[k];    
        }
    }
    )
    updateRes();
})

curstruct = null

/**
 * 
 * @param {Tile} shape Tile to display info of
 */
function displayTileInfo(shape) {
    TileInfo.innerHTML = shape.getNameCard()
    TileInfo.style.borderColor = colors[shape.biome];
    
    if (grid.elements.find(e=>{return e.tile==shape})) {
        let r = document.createElement('button')
        r.innerHTML = 'take the tile off of the map and put it into the inventory'
        r.addEventListener('click', e=>{
            move(grid.elements, inv,
                e=>{return e.tile==shape},
                shape)

            console.log(grid.elements, inv, 'ppp')
            display_inv()
            re_map()
            render_grid(grid)
            TileInfo.innerHTML = 'Nothing'
            TileInfo.style.borderColor = 'red'
        })
        TileInfo.appendChild(r)
    }
    
}

const mpos = [0,0]
var selectedStruct = [-1,-1]

c.addEventListener('mousemove', mouse_move_main)

/**
 * Calculates mouse position on grid
 * @param {Event} e 
 */
function mouse_move_main(e) {
    const canvas_b = c.getBoundingClientRect()
    w = Math.floor((e.clientX-canvas_b.left)/grid.size)
    h = Math.floor((e.clientY-canvas_b.top)/grid.size)

    if ((w!=mpos[0] || h!=mpos[1])&&w>-1&&h>-1) {
        mouse_move_cycle(w, h);   
    }
}

/**
 * Renders mouse highlight, selections, info
 * @param {number} w mouse pos x
 * @param {number} h mouse pos y
 */
function mouse_move_cycle(w, h) {
    ctx.putImageData(grid.image, 0, 0);
    ctx.beginPath();
    if (selectedStruct[0] == -1) {
        ctx.strokeStyle = 'white'
        ctx.rect(w*grid.size, h*grid.size, grid.size, grid.size);
    } else {
        ctx.strokeStyle = 'red'
        ctx.rect(selectedStruct[0]*grid.size, selectedStruct[1]*grid.size, grid.size, grid.size);
    }

    ctx.stroke();
    mpos[0] = w;
    mpos[1] = h;
    
    if (inv[selected] && selected>=0) {
        draw_preview(inv[selected], w, h);
    } else if (selectedStruct[0] == -1) {
        add_struct_info(grid.map[w][h], [w,h])
    }  else {
        add_struct_info(grid.map[selectedStruct[0]][selectedStruct[1]], selectedStruct)
    }
}

/**
 * Displays info about a grid element
 * @param {Struc}   element Struc to display
 * @param {boolean} draw    draw highlight of the shape
 */
function add_struct_info(element, draw=false) {
    switch (element.c) {
        case 1:
            StructInfo.innerHTML = biomenames[element.b]
            break;
        case 2:
            if (draw) {
                draw_preview(element.main, draw[0], draw[1])
            }
            displayTileInfo(element.main);
            StructInfo.innerHTML = `Center
            <br>${biomenames[element.b]}`
            break;
        case 3:
            curstruct = element
            StructInfo.innerHTML = element.getInfoCard()
            const up = document.createElement('button')
            up.innerHTML = 'upgrade the currently selected structure'
            up.addEventListener('click', e=>{
                element.upgrade();
                add_struct_info(element)
            })
            StructInfo.appendChild(up)
            break;
        default:
            StructInfo.innerHTML = 'Nothing'
            break;
    }
}

//stuff
c.addEventListener('click', function (e) {
    const canvas_b = c.getBoundingClientRect()
    w = Math.floor((e.clientX-canvas_b.left)/grid.size)
    h = Math.floor((e.clientY-canvas_b.top)/grid.size)
    if (inv[selected]) {
        if (selected>=0) {
            a = inv.findIndex(e=>{return e==inv[selected]})

            if (a!=undefined) {
                grid.elements.push({tile:inv[selected], x:w, y:h})
            }

            if (re_map().length==0) {
                inv.splice(a,1)
                display_inv()
                render_grid(grid)
                selected = -1;
            }
        }
    } else {
        console.log(selected, selectedStruct)
        if (selectedStruct[0]==w && selectedStruct[1]==h) {
            selectedStruct = [-1, -1]
        } else {
            selectedStruct = [w, h]
            add_struct_info(grid.map[w][h])
            mouse_move_cycle(w, h)
        }
        
    }
})

c.addEventListener('mouseleave', e=>{
})