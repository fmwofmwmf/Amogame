const nextday = document.getElementById('day')

const TileInfo = document.getElementById('Tileinfo')
const StructInfo = document.getElementById('Structinfo')
const resources = document.getElementById('money')
const upgradee = document.getElementById('upgrade')

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
upgradee.addEventListener('click', (e) => {upstruct()})

function upstruct() {
    if (curstruct) {
        curstruct.upgrade();
        displayStructInfo(curstruct)

    }
}

curstruct = null

function displayTileInfo(shape) {
    TileInfo.innerHTML = shape.getNameCard()
    TileInfo.style.borderColor = colors[shape.biome];
}

const mpos = [0,0]

c.addEventListener('mousemove', function (e) {
    const canvas_b = c.getBoundingClientRect()
    w = Math.floor((e.clientX-canvas_b.left)/grid.size)
    h = Math.floor((e.clientY-canvas_b.top)/grid.size)

    if (w!=mpos[0] || h!=mpos[1]) {
        ctx.putImageData(grid.image, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = 'white'
        ctx.rect(w*grid.size, h*grid.size, grid.size, grid.size);
        ctx.stroke();
        mpos[0] = w;
        mpos[1] = h;
        if (inv[selected] && selected>=0) {
            draw_outline(inv[selected], w, h);
        } else {
            switch (grid.map[w][h].c) {
                case 1:
                    StructInfo.innerHTML = biomenames[grid.map[w][h].b]
                    break;
                case 2:
                    draw_outline(grid.map[w][h].main, w, h)
                    displayTileInfo(grid.map[w][h].main);
                    StructInfo.innerHTML = `Center
                    <br>${biomenames[grid.map[w][h].b]}`
                    break;
                case 3:
                    curstruct = grid.map[w][h]
                    StructInfo.innerHTML = grid.map[w][h].getInfoCard()
                    break;
                default:
                    break;
            }
        }
    }
})

c.addEventListener('click', function (e) {
    const canvas_b = c.getBoundingClientRect()
    w = Math.floor((e.clientX-canvas_b.left)/grid.size)
    h = Math.floor((e.clientY-canvas_b.top)/grid.size)
    if (inv[selected] && selected>=0) {

        a = inv.findIndex(e=>{return e==inv[selected]})
        if (a!=undefined) {
            grid.elements.push({tile:inv[selected], x:w, y:h})
        }
        const res = re_map()
        console.log(res)
        if (res.length==0) {
            console.log(a)
            inv.splice(a,1)
            display_inv()
            grid = re_g(grid)
            selected = -1;
        }
    } else if (grid.map[w][h].c==2) {
        move(grid.elements, inv,
            e=>{return e.tile==grid.map[w][h].main},
            grid.map[w][h].main)
        display_inv()
        re_map()
        grid = re_g(grid)
    }
})