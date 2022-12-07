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


class Collapse {
    constructor(collapseid, uncollapseid, containerid) {
        this.collapse = document.getElementById(collapseid)
        this.uncollapse = document.getElementById(uncollapseid)
        this.container = document.getElementById(containerid)
        this.container_display = this.container.style.display

        this.uncollapse.style.display = "none"
        this.collapse.addEventListener('click', e => {
            this.do_collapse()
        })
        this.uncollapse.addEventListener('click', e => {
            this.do_uncollapse()
        })
    }

    do_collapse() {
        this.container.style.display = "none"
        this.uncollapse.style.display = "flex"
    }

    do_uncollapse() {
        this.container.style.display = this.container_display
        this.uncollapse.style.display = "none"
    }

}

const resource_collapse = new Collapse("resource-collapse-button", "resource-uncollapse-button", "resource-container")
const display_collapse = new Collapse("display-collapse-button", "display-uncollapse-button", "display-container")
const log_collapse = new Collapse("log-collapse-button", "log-uncollapse-button", "log-container")
const inv_collapse = new Collapse("inv-collapse-button", "inv-uncollapse-button", "inv-container")

