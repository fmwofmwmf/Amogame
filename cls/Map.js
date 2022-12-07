class Map {
    constructor(w, h, s, e, canvas, mode='2d') {
        this.w = w
        this.h = h;
        this.size = s;
        this.empty = e

        this.c = document.getElementById(canvas);
        this.ctx = this.c.getContext(mode, {willReadFrequently: true});
        this.map = this.gen_empty();

        this.c.width = this.w*this.size;
        this.c.height = this.h*this.size;
        
        this.image = undefined
    }

    gen_empty() {
        const arr = [];
        for (let j = 0; j < this.w; j++) {
            arr[j] = new Array(this.h)
            for (let i = 0; i < this.h; i++) {
                if (typeof this.empty == "object")
                arr[j][i] = Object.create(this.empty)
                else
                arr[j][i] = (this.empty)
            }
        }
        return arr
    }
}