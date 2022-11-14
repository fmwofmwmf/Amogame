const loot_count = document.getElementById('lootcrates')
const lootinfo = document.getElementById('lootopen')

const shop_button = document.getElementById('shop-button')
const boxes_button = document.getElementById('box-button')

const store = document.getElementById('shop')
const boxes = document.getElementById('lootboxes')

var lootcrates = [5,5,5,5,5,5,Infinity,Infinity]

const store_items = [
    {
        'desc1':'buy a D crate',
        'price':'-2 foods',
        'gives':'+1 [D] crate',
        check:()=>{return eco.food>=2},
        sub:()=>{eco.food-=2;
        updateRes()
        },
        add:()=>{
            lootcrates[1]++;
            refresh_loot();
        },
    },
    {
        'desc1':'buy a C crate',
        'price':'-5 foods',
        'gives':'+1 [C] crate',
        check:()=>{return eco.food>=5},
        sub:()=>{eco.food-=5;
        updateRes()
        },
        add:()=>{
            lootcrates[2]++;
            refresh_loot();
        },
    }
]

function shop(check, subtract, add) {
    console.log(check())
    if (check()) {
        subtract()
        add()
        console.log(inv)
        return true
    } else {
        return false
    }
}

function update_store() {
    store_items.forEach(e => {
        s = document.createElement('div')
        s.classList = 'shop-e tooltip'
        s.innerHTML = `${e.desc1}`
        const info = document.createElement('span')
        info.innerHTML = `${e.price}<br>${e.gives}`
        info.classList = 'tooltiptext'
        s.appendChild(info)
        s.addEventListener('click', ev=>{
            if (shop(e.check, e.sub, e.add)) {
            } else {
            }
        })
        store.append(s)
    });
}
update_store()

function refresh_loot() {
    loot_count.innerHTML = ''
    for (let i = 0; i < lootcrates.length; i++) {
        const l = lootcrates[i];
        const loot = document.createElement('div')
        loot.innerHTML = `[${grades[i]}] ${l}<br>`
        loot.className = 'crate'
        if (l>0) {
            loot.className += ' cratee'
            loot.addEventListener('click', e=>{
                lootcrates[i]--;
                refresh_loot()
                const loot = loot_roll(10,[1,2,3,4,5],[1,5,10,70,5], box_tile_odd[i], box_tile_odd[i])
                add_loot(loot)

                display_inv()
                display_cinv()
            })
        }
        loot_count.appendChild(loot)
    }
}

refresh_loot()

function add_loot(crate) {
    console.log(crate)
    crate.tiles.forEach(e => {
        inv.push(e)
    });
    crate.cards.forEach(e => {
        cinv.push(e)
    });
}

shop_button.addEventListener('click', e=>{
    store.style.display = 'block'
    boxes.style.display = 'none'
})

boxes_button.addEventListener('click', e=>{
    store.style.display = 'none'
    boxes.style.display = 'grid'
})