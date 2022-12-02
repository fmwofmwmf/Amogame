class Area extends Land {
    constructor(w, h, s, canvas_land, canvas_biome, canvas_path, container) {
        super(w, h, s, canvas_land);
        this.container = document.getElementById(container);
        this.biome_map = new Biomes(w, h, s, canvas_biome)
        this.path_map = new Path(w, h, s, canvas_path)
    }

    resize(w, h) {
        this.container.width = w
        this.container.height = h
        this.size = Math.min(w/this.w, h/this.h)
        this.refresh()
        this.biome_map.size = this.size
        this.biome_map.refresh()
    }


    pathEvent() {
        
    }
}

function bindToggle() {
    const toggle = (button, css) => {
        let t = true;
        const c = document.getElementsByClassName(css)
        button.addEventListener('click', e=>{
            if (t) {
                for (let i = 0; i < c.length; i++) {
                    c[i].style.display = 'none'   
                    button.classList.add("button_active")
                }
                t = false
            } else {
                for (let i = 0; i < c.length; i++) {
                    c[i].style.display = 'block'
                    button.classList.remove("button_active")   
                }
                t = true
            }
        })
    }

    toggle(document.getElementById('canvas-toggle-b'), 'biome-canvas');
    toggle(document.getElementById('canvas-toggle-p'), 'path-canvas');
    toggle(document.getElementById('canvas-toggle-s'), 's-canvas');
}

bindToggle()

const restrict = [450, 300]
const siz = [[15, 10], [30, 20], [70, 20]]

for (let i = 0; i < 3; i++) {
    const s = Math.min(restrict[0]/siz[i][0], restrict[1]/siz[i][1])
    let y = new Area(siz[i][0], siz[i][1], s, `land-canvas-w${i+1}`, `biome-canvas-w${i+1}`, `path-canvas-w${i+1}`, `w${i+1}`)
}