class Area extends Land {
    constructor(w, h, s, canvas_land, canvas_biome, canvas_path, container) {
        super(w, h, s, canvas_land);
        this.container = document.getElementById(container);
        this.biome_map = new Biomes(w, h, s, canvas_biome)
        this.path_map = new Path(w, h, s, canvas_path)
        this.pathEvent()
    }

    resize(w, h) {
        this.container.width = w
        this.container.height = h
        this.size = Math.min(w/this.w, h/this.h)
        this.refresh()
        this.biome_map.size = this.size
        this.biome_map.refresh()
        this.path_map.size = this.size
        this.path_map.refresh()
    }

    pathEvent() {
        this.c.draggable = 'true';
        this.c.addEventListener('dragstart', e=>{
            const cb = this.c.getBoundingClientRect()
            const w = Math.floor((e.clientX-cb.left)/this.size)
            const h = Math.floor((e.clientY-cb.top)/this.size)
            
            e.dataTransfer.setDragImage(nothingimage(), 0, 0);
            
            if (this.map[w][h].c==3 || this.map[w][h].c==2) {
                e.dataTransfer.setData("good", true);
                e.dataTransfer.setData("w", w);
                e.dataTransfer.setData("h", h);
            }
            return false
        })

        this.c.addEventListener('dragover', e=>{
            e.preventDefault()
        })

        this.c.addEventListener('drop', e=>{
            if (e.dataTransfer.getData('good')) {
                const cb = this.c.getBoundingClientRect()
                const w = Math.floor((e.clientX-cb.left)/this.size), h = Math.floor((e.clientY-cb.top)/this.size),
                w1 = e.dataTransfer.getData('w'), h1 = e.dataTransfer.getData('h');
                const f = this.map[w][h], t = this.map[w1][h1];
                if ((t.c==3 || t.c==2) && f!=t) {
                    this.path_map.makepath([parseInt(w1),parseInt(h1)], [w,h], this.map)
                }
            }
        })
    }
}

function nothingimage() {
    let dragIcon = document.createElement('img');
    dragIcon.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    dragIcon.width = 0;
    dragIcon.height = 0;
    dragIcon.opacity = 0;
    return dragIcon
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
const areas = []

for (let i = 0; i < 3; i++) {
    const s = Math.min(restrict[0]/siz[i][0], restrict[1]/siz[i][1])
    areas.push(new Area(siz[i][0], siz[i][1], s, `land-canvas-w${i+1}`, `biome-canvas-w${i+1}`, `path-canvas-w${i+1}`, `w${i+1}`))
}

function resize() {
    const w = Math.max(400, window.innerWidth*0.4)
    document.getElementById("canvas-content").style.height = (w*2/3).toString() + "px"
    areas.forEach(area => {
        area.resize(w, w*0.8)
    });
}
resize()
onresize = resize