class Map {
    constructor(w, h, s, e) {
        this.w = w
        this.h = h;
        this.size = s;
        this.empty = e
        this.map = this.gen_empty();
        this.tile_list = []
        this.image = undefined
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