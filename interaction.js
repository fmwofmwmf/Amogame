const nextday = document.getElementById('day')

const TileInfo = document.getElementById('tile-info')
const StructInfo = document.getElementById('struct-info')

const navbar = document.getElementById('navbar')
const main = document.getElementById('main')



class NavBar {
    /**
     * 
     * @param {String[]} navsid 
     * @param {String[]} tabsid 
     * @param {String[]} specif  Specify what display to make the tabsid ie grid, flex or block
     * @param {number} start 
     */
    constructor(navsid, tabsid, specif, start=0) {
        this.navs = []
        this.specif = specif
        for (let i = 0; i < navsid.length; i++) {
            const id = navsid[i];
            let nav = document.getElementById(id)
            this.navs.push(nav)
            nav.addEventListener('click', e=>{
                this.switch_tab(i)
            })
        }
        this.tabs = []
        for (let i = 0; i < tabsid.length; i++) {
            const id = tabsid[i];
            let tab = document.getElementById(id)
            tab.style.display = "none"
            if (i == start) {
                tab.style.display = this.specif[start]
            }
            this.tabs.push(tab)
        }
        this.switch_tab(0)
    }

    switch_tab(index){
        for (let i = 0; i < this.tabs.length; i++) {
            const tab = this.tabs[i];
            const nav = this.navs[i];
            if (i == index) {
                tab.style.display = this.specif[index]
                nav.style.backgroundColor = '#eee';
            }
            else {
                tab.style.display = "none"
                nav.style.backgroundColor = 'white';
            }
        }
    }
}

const main_navbar = new NavBar(["page1", "page2", "page3"],
                            ["world-page", "shop-page", "game-page"],
                            ["grid", "grid", "grid"])

const area_navbar = new NavBar(["canvas-nav-w1", "canvas-nav-w2", "canvas-nav-w3"],
                            ["w1", "w2", "w3"],
                            ["grid", "grid", "grid"])

const inv_navbar = new NavBar(["inv-nav-tile", "inv-nav-card","inv-nav-box"],
                            ["inv-tile", "inv-card", "inv-box"],
                            ["block", "block", "block"])

const display_navbar = new NavBar(["display-nav-tile-info", "display-nav-struct-info", "display-nav-card-info"],
                            ["display-tile-info", "display-tile-struct", "display-tile-card"],
                            ["grid", "grid", "grid"])


nextday.addEventListener('click', (e) => {
    const land_eco = land_gride.get_income()
    addeco(land_eco)
})

function addeco(ob) {
    for (const k in ob) {
        eco[k] += ob[k]
    }
    updateRes();
}

// function switch_tabs(name) {
//     Array.from(main.children).forEach(e=>{
//         if (e.id==name) {
//             e.style.display = 'grid'
//         } else {
//             e.style.display = 'none'
//         }
//     })
// }

// Array.from(navbar.children).forEach(e=>{
//     e.addEventListener('click', ev=>{
//         switch_tabs('div'+e.id.slice(-1))
//     })
// })

// switch_tabs('div1')