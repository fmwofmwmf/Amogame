class Biomes extends Map {
    constructor(w, h, s, canvas) {
        super(w, h, s, 0, canvas);
        this.m = [-1,-1]
        this.selected = [-1,-1]
        this.map = newbiome(0,0,this.w, this.h) //biome(this.w, this.h, [1, 2, 3, 4], [30,30,30,30])
    }

    transform(box, s) {
        if (this.image===undefined || this.size!=s) {
            this.size = s;
            this.newrender(box)
        } else {
            this.ctx.rect(0, 0, this.c.width, this.c.height);
            this.ctx.fillStyle = 'grey';
            this.ctx.fill();
            this.ctx.putImageData(this.image.img, (this.image.L-box.L)*this.size, (this.image.T-box.T)*this.size, 0, 0, this.c.width, this.c.height)
            this.partialrender(box)
            // this.image = {
            //     L:box.L,
            //     T:box.T,
            //     W:box.W,
            //     H:box.H,
            //     img:this.ctx.getImageData(0, 0, this.c.width, this.c.height)
            // }
        }
    }

    partialrender(box) {
        for (let i = box.align_L; i < box.align_W; i++) {
            for (let j = box.align_T; j < box.align_H; j++) {
                if (i<this.image.L ||
                    j<this.image.T ||
                    i>this.image.L+this.image.W-1 ||
                    j>this.image.T+this.image.H-1) {
                    const x = this.size*(i-box.L), y = this.size*(j-box.T)
                    if (this.map[i] && this.map[i][j]) {
                        this.ctx.fillStyle = colors[this.map[i][j]]
                        this.ctx.fillRect(x, y, this.size, this.size);
                    }
                }
            }
        }
    }

    newrender(box) {
        const colors = ['lightGrey', 'lightGreen', 'cornsilk', 'darkSeaGreen', 'LawnGreen']
        let s = []
        this.ctx.rect(0, 0, this.c.width, this.c.height);
        this.ctx.fillStyle = 'grey';
        this.ctx.fill();
        for (let i = box.align_L; i < box.align_W; i++) {
            for (let j = box.align_T; j < box.align_H; j++) {

                const x = this.size*(i-box.L), y = this.size*(j-box.T)
                if (this.map[i] && this.map[i][j]) {
                    this.ctx.fillStyle = colors[this.map[i][j]]
                    this.ctx.fillRect(x, y, this.size, this.size);
                }
            }
        }
        this.image = {
            L:box.L,
            T:box.T,
            W:box.W,
            H:box.H,
            img:this.ctx.getImageData(0, 0, this.c.width, this.c.height)
        }
    }

    // render() {
    //     const colors = ['lightGrey', 'lightGreen', 'cornsilk', 'darkSeaGreen', 'LawnGreen']
    //     let s = []
    //     this.ctx.clearRect(0, 0, this.c.width, this.c.height)
    //     for (let i = 0; i < this.w; i++) {
    //         for (let j = 0; j < this.h; j++) {
    //             this.ctx.beginPath();
    //             const x = this.size*i, y = this.size*j
    //             switch (this.map[i][j]) {
    //                 default:
    //                     this.ctx.fillStyle = colors[this.map[i][j]]
    //                     break;
    //             }
    //             this.ctx.fillRect(x, y, this.size, this.size);
    //             this.ctx.closePath();
    //         }
    //     }
    //     this.image = this.ctx.getImageData(0, 0, this.c.width, this.c.height)
    // }
}

//const biome_grid = new Biomes(30, 20, 15, document.getElementById('biome-canvas-w1'))
