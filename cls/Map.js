class Map {
    constructor(w, h, s, e, canvas) {
        this.w = w
        this.h = h;
        this.size = s;
        this.empty = e

        this.c = document.getElementById(canvas);
        this.ctx = this.c.getContext("2d", {willReadFrequently: true});
        this.map = this.gen_empty();
        
        this.image = undefined
    }

    refresh() {
        this.c.width = this.w*this.size;
        this.c.height = this.h*this.size;
        this.render()
    }

    render() {

    }

    gen_empty() {
        const arr = [];
        for (let j = 0; j < this.w; j++) {
            arr[j] = new Array(this.h)
            for (let i = 0; i < this.h; i++) {
                arr[j][i] = JSON.parse(JSON.stringify(this.empty))
            }
        }
        return arr
    }
}