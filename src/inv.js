const hbar = document.getElementById('inv-tile')
const card_col = document.getElementById('inv-card')
const tile_col = document.getElementById('tile-inv')
const tile_slot = document.getElementById('tile-view-main')
const card_tree_m = document.getElementById('card-tree-main')

const inv = {
    tiles:[],
    tileHTML:[],
    cards:[],
    cardHTML:[],
    s_tile:null,
    set add_tile(tile) {
        this.tiles.push(tile)
        display_inv()
    },
    set rem_tile(tile) {
        inv.tiles.splice(inv.tiles.find(t=>{return t==tile}), 1)
        display_inv()
    },
    set add_card(card) {
        this.cards.push(card)
        display_cinv()
    },
    set rem_card(card) {
        inv.cards.splice(inv.cards.find(c=>{return c==card}), 1)
        display_cinv()
    }
}


for (let i = 0; i < 1; i++) {
    b = randint(5,100);
    inv.add_tile = generate_tile(b, Math.ceil(Math.sqrt(b)/3));
}

var selected_card = null
var selected_tile = null
inv.cards = [new Card('structure', 'power', 0), new Card('branch', '2-fork', 1), new Card('structure', 'power', 0), new Card('structure', 'power', 1)]


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
    if (inv.s_tile==j) {
        inv.tileHTML[j].className = "hotbar-e"
        inv.s_tile = -1
    } else {
        if (inv.tiles[inv.s_tile] && inv.s_tile != -1)
            inv.tileHTML[inv.s_tile].className = "hotbar-e"
        inv.tileHTML[j].className = "hotbar-e hotbar-e-selected"
        inv.s_tile = j
        displayTileInfo(inv.tiles[j], TileInfo, null, true)
    }
}

/**
 * Displays inv as HTML elements
 */
function display_inv() {
    hbar.innerHTML = ''
    inv.tileHTML = [];
    for (let i = 0; i < inv.tiles.length; i++) {
        const e = inv.tiles[i];
        const s = document.createElement('div');
        Object.assign(s, {className: 'hotbar-e' });
        s.innerHTML=`${tiers[e.tier]}`
        s.addEventListener('click', e => {
            select(i)
            //grid['image'] = render_grid(grid.size, grid.map, ctx)
        })
        inv.tileHTML[i] = s;
        hbar.appendChild(s)
    }
}
display_inv()

function filter_cinv() {
    let y = {}
    inv.cards.forEach(e => {
        if (y[e.type] != undefined) {
            y[e.type].push(e)
        } else {
            y[e.type] = [e]
        }
        
    });
    return y
}

function display_cinv() {
    card_col.innerHTML = ''
    inv.cardHTML = [];
    for (let i = 0; i < inv.cards.length; i++) {
        const e = inv.cards[i];
        const s = document.createElement('div');
        
        s.innerHTML = e.getInfo()
        s.classList = 'card-inv-e'
        s.draggable = true;
        s.addEventListener('dragstart', ev => {
            ev.dataTransfer.setData("index", i);
            ev.dataTransfer.setData("type", e.type);
        })
        s.addEventListener('click', ev=>{
            switch (display_navbar.current) {
                case 0:
                    console.log(current_tile)
                    if (current_tile) {
                        for (let i = 0; i < current_tile.cards.length; i++) {
                            const ch = current_tile.cards[i];
                            if (ch.card==null) {
                                ch.tryadd(e)
                                break;
                            }
                        }
                    }
                    break;
                case 1:
                    if (current_struc) {
                        for (let i = 0; i < current_struc.cards.length; i++) {
                            const ch = current_struc.cards[i];
                            if (ch.card==null) {
                                ch.tryadd(e)
                                break;
                            }
                        }
                    }
                    break;
                case 2:
            
                    break;
            
                default:
                    break;
            }
        })
        inv.cardHTML[i] = s;
        card_col.appendChild(s)
    }
}

card_tree_m.addEventListener('dragover', e=>{
    e.preventDefault()
})

card_tree_m.addEventListener('drop', e=>{
    const i = e.dataTransfer.getData("index")
    if (selected_card!=null) {
        inv.add_card = selected_card
    }
    selected_card = inv.cards[i]
    inv.rem_card = inv.cards[i]
    display_card()
})

function display_card() {
    card_tree_m.innerHTML = '';
    const s = document.createElement('div');
    s.className = 'tile-tree-e'
    s.innerHTML=`${selected_card.getInfo()}`
    const up = document.createElement('div')
    up.className = 'button'
    up.innerHTML = '+'
    up.addEventListener('click', e=>{
        if (selected_card.upgrade()) {
            display_card()
        }
    })
    
    const down = document.createElement('div')
    down.className = 'button'
    down.innerHTML = '-'
    down.addEventListener('click', e=>{
        inv.add_card = selected_card
        selected_card = null
        card_tree_m.innerHTML = '';
    })
    s.appendChild(up)
    s.appendChild(down)
    card_tree_m.appendChild(s)
}

display_cinv()