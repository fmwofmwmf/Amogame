class Area extends Land {
    constructor(w, h, s, canvas_land, canvas_biome, canvas_path, container) {
        super(w, h, s, canvas_land);
        this.container = document.getElementById(container);
        this.biome_map = new Biomes(w, h, s, canvas_biome)
        //this.path_map = new Path(w, h, s, canvas_path)
        this.pathEvent()

        this.container.width = w*s
        this.container.height = h*s
        ///dont remove :)
        

        document.addEventListener('keydown', e => {
            const callback = {
                "ArrowUp"    : ()=>{if (this.size!=30) {this.move(0,0,1)}},
                "ArrowDown"  : ()=>{if (this.size>4) {this.move(0,0,-1)}},
                " " : ()=>{this.move(0,0,0)},
            }[e.key]
            callback?.()
            console.log(e.key==' ')
        });
    }

    resize(w, h) {
        this.container.width = w
        this.container.height = h
        this.c.width = w
        this.c.height = h
        this.biome_map.c.width = w
        this.biome_map.c.height = h
        this.transform(0, 0, this.size)
        //this.render()
        //this.biome_map.newrender(this.render_box)
        
        //this.path_map.refresh()
    }

    move(dx, dy, ds) {
        this.transform(this.xoff+dx, this.yoff+dy, this.size+ds)
    }

    //offsets assume top left is at (0, 0)
    transform(x, y, s) {
        this.xoff = x;
        this.yoff = y;
        this.render_box = {
            align_L:Math.floor(x/s),
            align_T:Math.floor(y/s),
            align_W:Math.ceil((this.c.width)/s),
            align_H:Math.ceil((this.c.height)/s),
            L:x/s,
            T:y/s,
            W:this.c.width/s,
            H:this.c.height/s
        }
        
        if (this.size!=s) {
            this.size = s;
            this.render(this.render_box)
        } else {
            this.refresh(this.render_box, false)
        }
        this.biome_map.transform(this.render_box, this.size)
        
    }


    pathEvent() {
        this.c.draggable = 'true';
        let ppos = [,]
        this.c.addEventListener('dragstart', e=>{
            if (!pathmode) {
                ppos = [e.clientX, e.clientY]
                
            } else {
                const cb = this.c.getBoundingClientRect()
                const w = Math.floor((e.clientX-cb.left)/this.size)
                const h = Math.floor((e.clientY-cb.top)/this.size)
                if (this.map[w][h].c==3 || this.map[w][h].c==2) {
                    e.dataTransfer.setData("good", true);
                    e.dataTransfer.setData("w", w);
                    e.dataTransfer.setData("h", h);
                }
            }
            e.dataTransfer.setDragImage(nothingimage(), 0, 0);
        })

        let moved = false
        this.c.addEventListener('dragover', e=>{
            if (!moved) {
                if (!pathmode) {
                    this.move(ppos[0]-e.clientX, ppos[1]-e.clientY, 0)
                    ppos = [e.clientX, e.clientY]
                }
                moved = true
                setTimeout(() => {
                    moved = false
                }, 10);
            }
            e.preventDefault()
        })

        this.c.addEventListener('drop', e=>{
            if (pathmode) {
                if (e.dataTransfer.getData('good')) {
                    const cb = this.c.getBoundingClientRect()
                    const w = Math.floor((e.clientX-cb.left)/this.size), h = Math.floor((e.clientY-cb.top)/this.size),
                    w1 = e.dataTransfer.getData('w'), h1 = e.dataTransfer.getData('h');
                    const f = this.map[w][h], t = this.map[w1][h1];
                    if ((t.c==3 || t.c==2) && f!=t) {
                        this.path_map.makepath([parseInt(w1),parseInt(h1)], [w,h], this.map)
                    }
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
    document.getElementById('canvas-toggle-s').addEventListener('click', e => {
        if (pathmode) {
            document.getElementById('canvas-toggle-s').classList.remove("button_active")
            pathmode = false
        } else {
            document.getElementById('canvas-toggle-s').classList.add("button_active")
            pathmode = true
        }
    });
}
var pathmode = false
bindToggle()

const restrict = [450, 300]
const siz = [[200, 200], [30, 20], [500, 500]]
const areas = []

for (let i = 0; i < 1; i++) {
    const s = 15
    areas.push(new Area(siz[i][0], siz[i][1], s, `land-canvas-w${i+1}`, `biome-canvas-w${i+1}`, `path-canvas-w${i+1}`, `w${i+1}`))
}

function resize() {
    const w = Math.max(400, window.innerWidth*0.4)
    areas.forEach(area => {
        if (w>1) area.resize(window.innerWidth,
            window.innerHeight)
    });
}
resize()
onresize = resize