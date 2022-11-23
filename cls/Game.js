class Game extends Land {
    constructor(w,h,s,canv) {
        super(w, h, s, canv);
    }
}

const game = new Game(20, 20, 15, 'game-1-canvas')