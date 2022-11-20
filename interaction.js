const nextday = document.getElementById('day')

const TileInfo = document.getElementById('tile-info')
const StructInfo = document.getElementById('struct-info')




class NavBar {
    /**
     * 
     * @param {String} navid 
     * @param {String} tabid 
     */
    constructor(navid, tabid) {
        this.navbar = document.getElementById(navid)
        this.navs = this.navbar.children
        this.tabscont = document.getElementById(tabid)
        this.tabs = this.tabscont.children
        this.specif = []

        for (let i = 0; i < this.navs.length; i++) {
            const elem = this.navs[i];
            elem.addEventListener('click', e=>{
                this.switch_tab(i)
            })
        }
        for (let i = 0; i < this.tabs.length; i++) {
            const elem = this.tabs[i];
            let setstyle = elem.style.display
            this.specif.push(setstyle)
            if (i != 0){
                elem.style.display = "none"
            }
        }
    }

    switch_tab(index){
        for (let i = 0; i < this.tabs.length; i++) {
            const tab = this.tabs[i];
            if (i == index) {
                tab.style.display = this.specif[index]
            }
            else {
                tab.style.display = "none"
            }
        }
    }
}

let main_navbar = new NavBar("navbar", "main")
let inv_navbar = new NavBar("inv-navbar", "inv-content")
let canvas_navbar = new NavBar("canvas-navbar", "canvas-content")
let display_navbar = new NavBar("display-navbar", "display-content")



nextday.addEventListener('click', (e) => {
    const land_eco = land_grid.get_income()
    for (const k in land_eco) {
        eco[k] += land_eco[k]
    }
    updateRes();
})
