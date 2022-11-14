const hbar = document.getElementById('hotbar')
const card_col = document.getElementById('card-inv')
const tile_col = document.getElementById('tile-inv')
const tile_slot = document.getElementById('tile-view-m')
const card_tree_m = document.getElementById('card-tree-main')

var collHTML = []

var selected_card = null
var cinv = [new Card('structure', 'power', 0), new Card('structure', 'power', 1)]
var cinvHTML = []
var selected_tile = null
var c_tree_selected = -1

/**
 * Moves obj between array
 * @param {any[]}   from    original array
 * @param {any[]}   to      destination array
 * @param {any}     match   target object
 * @param {any}     package new target object (CHANGE TO FUNC)
 */
function move(from, to, match, package) {
    a = from.findIndex(match)
    if (a!=undefined) {
        from.splice(a, 1)
        to.push(package)
    }
}

/**
 * Selects/deselects an element in inv
 * @param {number} j index of element to select
 */
function select(j) {
    if (selected==j) {
        invHTML[j].className = "hotbar-e"
        selected = -1
    } else {
        if (inv[selected] && selected != -1)
            invHTML[selected].className = "hotbar-e"
        invHTML[j].className = "hotbar-e hotbar-e-selected"
        selected = j
        displayTileInfo(inv[j], TileInfo, true)
    }
}

/**
 * Displays inv as HTML elements
 */
function display_inv() {
    hbar.innerHTML = ''
    invHTML = [];
    for (let i = 0; i < inv.length; i++) {
        const e = inv[i];
        const s = document.createElement('div');
        Object.assign(s, {className: 'hotbar-e' });
        s.innerHTML=`${tiers[e.tier]}`
        s.addEventListener('click', e => {
            select(i)
            //grid['image'] = render_grid(grid.size, grid.map, ctx)
        })
        invHTML[i] = s;
        hbar.appendChild(s)
    }
    display_collection()
}
display_inv()

function display_collection() {
    tile_col.innerHTML = ''
    collHTML = []
    for (let i = 0; i < inv.length; i++) {
        const e = inv[i];
        const s = document.createElement('div');
        s.className = 'tile-inv-e'
        s.innerHTML=`${tiers[e.tier]}`
        s.draggable = true;
        s.addEventListener('dragstart', ev => {
            ev.dataTransfer.setData("index", i);
        })
        collHTML[i] = s;
        tile_col.appendChild(s)
    }
}

tile_slot.addEventListener('dragover', e=>{
    e.preventDefault()
})
tile_slot.addEventListener('drop', e=>{
    const i = e.dataTransfer.getData("index")
    if (selected_tile!=null) {
        inv.push(selected_tile)
    }
    selected_tile = inv[i]
    inv.splice(i, 1)
    display_inv()
    displayTileInfo(selected_tile, tile_slot)
    const d = document.createElement('span')
    d.innerHTML = '-'
    d.addEventListener('click', e=>{
        inv.push(selected_tile);
        selected_tile = null;
        display_inv()
        tile_slot.innerHTML = '';
    })
    tile_slot.appendChild(d);
})

function display_cinv() {
    card_col.innerHTML = ''
    cinvHTML = [];
    for (let i = 0; i < cinv.length; i++) {
        const e = cinv[i];
        const s = document.createElement('div');
        
        s.innerHTML = e.getInfo()
        s.classList = 'card-inv-e'
        s.draggable = true;
        s.addEventListener('dragstart', ev => {
            ev.dataTransfer.setData("index", i);
        })
        cinvHTML[i] = s;
        card_col.appendChild(s)
    }
}

card_tree_m.addEventListener('dragover', e=>{
    e.preventDefault()
})
card_tree_m.addEventListener('drop', e=>{
    const i = e.dataTransfer.getData("index")
    if (selected_card!=null) {
        cinv.push(selected_card)
    }
    selected_card = cinv[i]
    cinv.splice(i, 1)
    display_cinv()
    display_card()
})

function display_card() {
    card_tree_m.innerHTML = '';
    const s = document.createElement('div');
    s.className = 'tile-tree-e'
    s.innerHTML=`${selected_card.getInfo()}`
    card_tree_m.appendChild(s)
}

display_cinv()