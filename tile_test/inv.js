const hbar = document.getElementById('hotbar')


function move(from, to, match, package) {
    a = from.findIndex(match)
    console.log(from, a)
    if (a!=undefined) {
        from.splice(a, 1)
        to.push(package)
    }
}

var inv = [generate_tile(5, 1), generate_tile(15, 3), generate_tile(25, 4)]
for (let i = 0; i < 25; i++) {
    b = randint(5,100)
    inv[i] = generate_tile(b, Math.ceil(Math.sqrt(b)/3))
    
}
var invHTML = []
var selected = -1

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