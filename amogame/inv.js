const hbar = document.getElementById('hotbar')

var inv = []
for (let i = 0; i < 1; i++) {
    b = randint(5,100)
    inv[i] = generate_tile(b, Math.ceil(Math.sqrt(b)/3))
    
}
var invHTML = []
var selected = -1

/**
 * Moves obj between array
 * @param {any[]}   from    original array
 * @param {any[]}   to      destination array
 * @param {any}     match   target object
 * @param {any}     package new target object (CHANGE TO FUNC)
 */
function move(from, to, match, package) {
    a = from.findIndex(match)
    console.log(from, a)
    if (a!=undefined) {
        from.splice(a, 1)
        to.push(package)
    }
}

/**
 * Selects/deselectes an element in inv
 * @param {number} j index of element to select
 */
function select(j) {
    console.log(selected, j)
    if (selected==j) {
        invHTML[j].className = "hotbar-e"
        selected = -1
    } else {
        if (inv[selected] && selected != -1)
            invHTML[selected].className = "hotbar-e"
        invHTML[j].className = "hotbar-e hotbar-e-selected"
        selected = j
        displayTileInfo(inv[j])
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
        })
        invHTML[i] = s;
        hbar.appendChild(s)
    }
}

display_inv()