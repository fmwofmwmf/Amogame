class Area extends Land {
    constructor(w, h, s, canvas_land, canvas_biome, container) {
        super(w, h, s, canvas_land);
        this.container = document.getElementById(container);
        this.biome_map = new Biomes(w, h, s, canvas_biome)
        this.nobiome()
    }

    resize(w, h) {
        this.container.width = w
        this.container.height = h
        this.size = Math.min(w/this.w, h/this.h)
        this.refresh()
        this.biome_map.size = this.size
        this.biome_map.refresh()
    }

    nobiome() {
        this.toggle_biome = document.createElement('div')
        this.toggle_biome.className = "button toggle-biome"
        this.toggle_biome.innerHTML = '-B'
        this.toggle_biome.addEventListener('click', ()=>{
            if (this.biome_map.c.style.display == 'none') {
                this.biome_map.c.style.display = 'block'
                this.toggle_biome.innerHTML = '-B'
            } else {
                this.biome_map.c.style.display = 'none'
                this.toggle_biome.innerHTML = '+B'
            }
        })
        this.container.appendChild(this.toggle_biome)
    }
}

const restrict = [450, 300]
const siz = [[15, 10], [30, 20], [70, 20]]

for (let i = 0; i < 3; i++) {
    const s = Math.min(restrict[0]/siz[i][0], restrict[1]/siz[i][1])
    let y = new Area(siz[i][0], siz[i][1], s, `land-canvas-w${i+1}`, `biome-canvas-w${i+1}`, `w${i+1}`)
}