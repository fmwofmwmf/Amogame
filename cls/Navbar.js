const TileInfo = document.getElementById('tile-info')

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
        this.current = 0

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
        this.switch_tab(this.current)
    }

    switch_tab(index){
        this.current = index
        for (let i = 0; i < this.tabs.length; i++) {
            const tab = this.tabs[i];
            const nav = this.navs[i];
            if (i == index) {
                tab.style.display = this.specif[index]
                nav.classList += ' nav_active';
            }
            else {
                tab.style.display = "none"
                nav.classList.remove('nav_active');
            }
        }
    }
}

const main_navbar = new NavBar("main_navbar", "main")
const inv_navbar = new NavBar("inv-navbar", "inv-content")
const display_navbar = new NavBar("display-navbar", "display-content")
const area_navbar = new NavBar("canvas-navbar", "canvas-content")

