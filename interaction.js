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
            const setstyle = elem.style.display
            this.specif.push((elem.style.display != "none") ? setstyle : '')
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

const main_navbar = new NavBar("navbar", "main")
const inv_navbar = new NavBar("inv-navbar", "inv-content")
const canvas_navbar = new NavBar("canvas-navbar", "canvas-content")
const display_navbar = new NavBar("display-navbar", "display-content")
const area_navbar = new NavBar("canvas-navbar", "canvas-content")

function addeco(ob) {
    for (const k in ob) {
        eco[k] += ob[k]
    }
    updateRes();
}
