class Path extends Map {
    constructor(w, h, s, canvas) {
        super(w, h, s, {max:0, con:[]}, canvas);
        this.paths = [{from:[2,3], to:[5,5]}]
        this.refresh();
    }

    render() {
        this.map = this.gen_empty()
        this.paths.forEach(p => {
            this.ctx.beginPath()
            this.ctx.moveTo((p.from[0]+0.5)*this.size, (p.from[1]+0.5)*this.size);
            this.ctx.lineTo((p.to[0]-0.5)*this.size, (p.to[1]-0.5)*this.size);
            this.ctx.stroke()
        });
    }

    makepath(from, to) {
        if (from.base_stats.max_paths<from.paths.length && to.base_stats.max_paths<to.paths.length) {
            const pat = {
                from:from,
                to:to,
            }
            from.paths.push(pat)
            to.paths.push(pat)
            this.paths.push(pat)
        }
    }
}

const pathinfo = document.getElementById('path-info')
