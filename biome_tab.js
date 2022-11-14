

class Biomes extends Map {
    constructor(w, h, s, canv) {
        super(w, h, s, 0);
        this.m = [-1,-1]
        this.c = canv;
        this.selected = [-1,-1]
        this.map = biome(this.w, this.h, [1, 2, 3, 4], [30,30,30,30])
        this.ctx = this.c.getContext("2d", {willReadFrequently: true})
        this.refresh()
    }

    refresh() {
        this.c.width = this.w*this.size;
        this.c.height = this.h*this.size;

        // this.tile_list.forEach(t => {
        //     t.tile.plot(t.x, t.y, this.w, this.h, this.map)
        // });
        this.render()
    }

    render() {
        const colors = ['lightGrey', 'lightGreen', 'cornsilk', 'darkSeaGreen', 'LawnGreen']
        let s = []
        this.ctx.clearRect(0, 0, this.c.width, this.c.height)
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                this.ctx.beginPath();
                const x = this.size*i, y = this.size*j
                switch (this.map[i][j]) {
                    default:
                        this.ctx.fillStyle = colors[this.map[i][j]]
                        break;
                }
                this.ctx.fillRect(x, y, this.size, this.size);
                this.ctx.closePath();
                
            }
        }
        this.image = this.ctx.getImageData(0, 0, this.c.width, this.c.height)
    }
}

const biome_grid = new Biomes(30, 20, 10, document.getElementById('biome'))
