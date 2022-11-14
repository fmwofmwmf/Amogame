const nextday = document.getElementById('day')

const TileInfo = document.getElementById('Tileinfo')
const StructInfo = document.getElementById('Structinfo')

const navbar = document.getElementById('navbar')
const main = document.getElementById('main')

nextday.addEventListener('click', (e) => {
    const land_eco = land_grid.get_income()
    for (const k in land_eco) {
        eco[k] += land_eco[k]
    }
    updateRes();
})

function switch_tabs(name) {
    Array.from(main.children).forEach(e=>{
        if (e.id==name) {
            e.style.display = 'grid'
            
        } else {
            e.style.display = 'none'
        }
    })
}

Array.from(navbar.children).forEach(e=>{
    e.addEventListener('click', ev=>{
        switch_tabs('div'+e.id.slice(-1))
    })
})

switch_tabs('div1')