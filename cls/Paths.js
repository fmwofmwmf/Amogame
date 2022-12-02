class Path extends Map {
    constructor(w, h, s, canvas) {
        super(w, h, s, {max:0, con:[]}, canvas);
        this.paths = []
        this.refresh();
    }

    set remove(p) {
        const ind = this.paths.indexOf(p)
        if (ind!=-1) {
            this.paths[ind].from.paths.splice(this.paths[ind].from.paths.indexOf(p), 1)
            this.paths[ind].to.paths.splice(this.paths[ind].to.paths.indexOf(p), 1)
            this.paths.splice(ind, 1)
            this.render()
            
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.w*this.size, this.w*this.size)
        this.paths.forEach(p => {
            this.ctx.beginPath()
            const m = Math.sqrt(Math.pow((p.f[0]-p.t[0]),2) + Math.pow((p.f[1]-p.t[1]),2))
            const v = [(p.f[0]-p.t[0])/m, (p.f[1]-p.t[1])/m]
            const l = 0.3
            const sta = [p.f[0]+0.5+v[1]/8,p.f[1]+0.5-v[0]/8]
            const end = [p.t[0]+0.5+v[1]/8, p.t[1]+0.5-v[0]/8]

            this.ctx.moveTo(sta[0]*this.size, sta[1]*this.size);
            this.ctx.lineTo(end[0]*this.size, end[1]*this.size);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.lineTo((sta[0]-v[0]*(m/2-l))*this.size,
                            (sta[1]-v[1]*(m/2-l))*this.size);
            this.ctx.lineTo((sta[0]-v[0]*(m/2-l)+v[1]*0.3)*this.size,
                            (sta[1]-v[1]*(m/2-l)-v[0]*0.3)*this.size);
            this.ctx.lineTo((sta[0]-v[0]*(m/2+l))*this.size,
                            (sta[1]-v[1]*(m/2+l))*this.size);
            this.ctx.fill();
        });
    }

    pathValid(p) {
        let yep = true
        this.paths.forEach(p1 => {
            if (p.f[0]==p1.f[0]&&p.f[1]==p1.f[1]&&p.t[0]==p1.t[0]&&p.t[1]==p1.t[1]) {
                console.log('haha haha')
                yep = false
            }
        });
        return yep
    }

    makepath(from, to, map) {
        const pat = {
            from:map[from[0]][from[1]],
            f:from,
            to:map[to[0]][to[1]],
            t:to,
        }
        if (pat.from.base_stats.max_paths>pat.from.paths.length &&
            pat.to.base_stats.max_paths>pat.to.paths.length && this.pathValid(pat)) {
            pat.from.paths.push(pat)
            pat.to.paths.push(pat)
            this.paths.push(pat)
            console.log(this.paths)
            this.render()
        }
    }
}

const pathinfo = document.getElementById('path-info')
