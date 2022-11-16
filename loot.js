const loot_count = document.getElementById('lootcrates')
const lootinfo = document.getElementById('lootopen')

const shop_button = document.getElementById('shop-button')
const boxes_button = document.getElementById('box-button')

const store = document.getElementById('shop')
const boxes = document.getElementById('lootboxes')

var lootboxes = {
    'T':{
        count:Infinity,
        unbox:(c)=>{
            return {tiles:[generate_connect(randint(4, 6)), generate_connect(randint(4,5))], cards:[], res:[], shards:[]}
        },
    },
    'BT':{
        count:Infinity,
        unbox:(c)=>{
            return {tiles:[generate_connect(randint(6, 15)), generate_connect(randint(4,5))], cards:[], res:[], shards:[]}
        },
    },
    'F':{
        count:Infinity,
        unbox:(c)=>{
            return loot_roll(10,[1,2,3,4,5],[1,5,60,30,5], box_tile_odd[0], box_tile_odd[0])
        },
    },
    'D':{
        count:0,
        unbox:(c)=>{
            return loot_roll(10,[1,2,3,4,5],[1,5,60,30,5], box_tile_odd[1], box_tile_odd[1])
        },
    },
    'C':{
        count:0,
        unbox:(c)=>{
            return loot_roll(10,[1,2,3,4,5],[1,5,60,30,5], box_tile_odd[2], box_tile_odd[2])
        },
    },
    'B':{
        count:0,
        unbox:(c)=>{
            return loot_roll(10,[1,2,3,4,5],[1,5,60,30,5], box_tile_odd[3], box_tile_odd[3])
        },
    },
    'A':{
        count:0,
        unbox:(c)=>{
            return loot_roll(10,[1,2,3,4,5],[1,5,60,30,5], box_tile_odd[4], box_tile_odd[4])
        },
    },
    'S':{
        count:0,
        unbox:(c)=>{
            return loot_roll(10,[1,2,3,4,5],[1,5,60,30,5], box_tile_odd[5], box_tile_odd[5])
        },
    },
    'SS':{
        count:Infinity,
        unbox:(c)=>{
            return loot_roll(10,[1,2,3,4,5],[1,5,60,30,5], box_tile_odd[6], box_tile_odd[6])
        },
    },
    'SSS':{
        count:5,
        unbox:(c)=>{
            return loot_roll(10,[1,2,3,4,5],[1,5,60,30,5], box_tile_odd[7], box_tile_odd[7])
        },
    },
}

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
            lootboxes['D'].count++;
            refresh_boxes();
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
            lootboxes['C'].count++;
            refresh_boxes();
        },
    }
]

function shop(check, subtract, add) {
    console.log(check())
    if (check()) {
        subtract()
        add()
        return true
    } else {
        return false
    }
}

function update_store() {
    store_items.forEach(e => {
        s = document.createElement('div')
        s.classList = 'shop-e tooltip button'
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

function refresh_boxes() {
    loot_count.innerHTML = ''
    for (const name in lootboxes) {
        const l = lootboxes[name]
        const loot = document.createElement('div')
        loot.innerHTML = `[${name}] ${l.count}<br>`
        loot.className = 'crate'
        if (l.count>0) {
            loot.className += ' cratee'
            loot.addEventListener('click', e=>{
                l.count--;
                refresh_boxes()
                const loot = l.unbox(1)
                add_loot(loot)
                lootinfo.innerHTML = loot_recap(loot)
                display_inv()
                display_cinv()
            })
        }
        loot_count.appendChild(loot)
    }
}
refresh_boxes()

function loot_recap(loot) {
    let out = {'tiles':{},'cards':{},'res':{},'shards':{}}
    for (const k in loot) {
        if (loot[k].length>0) {
            loot[k].forEach(e => {
                switch (k) {
                    case 'tiles':
                        const y = e.getName()
                        const id = `${y.tier} ${y.name} ${y.stars}`
                        out['tiles'][id] = out['tiles'][id] +1 || 1;
                        break;
                    case 'cards':
                        out['cards']['card'] = out['cards']['card'] + 1 || 1;
                        break;
                    case 'resources':
                        out['res'][e] = out['res'][e] + 1 || 1
                        break;
                    case 'shards':
                        out['shards'][e] = out['shards'][e] + 1 || 1;
                        break;
                    default:
                        break;
                }
            });
        }
    }
    let st=''
    const col = {'tiles':'cornsilk','cards':'azure', 'res':'white', 'shards':'white'}
    for (const i in out) {
        for (const j in out[i]) {
            st += `<div class='lootopen-e' style='background-color:${col[i]};'>
            ${out[i][j]}× ${j}</div>`
        }
    }
    return st
}

function add_loot(crate) {
    crate.tiles.forEach(e => {
        inv.push(e)
    });
    crate.cards.forEach(e => {
        cinv.push(e)
    });
}

shop_button.addEventListener('click', e=>{
    store.style.display = 'grid'
    boxes.style.display = 'none'
})

boxes_button.addEventListener('click', e=>{
    store.style.display = 'none'
    boxes.style.display = 'grid'
})