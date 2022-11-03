o = document.getElementById('out')
days = 1
day = document.getElementById('day')
day.addEventListener("click", passDay)
resources = {
    number:102391803271
}


function res() {
    o.innerHTML = resources.number
}
res()


class structure {
    constructor(stats, items) {
        this.stats = {
            name:null,
            income:0,
            level:0,
            rank:0,
            rankup:false,
            upcost:{},
            ...stats
        }
        this.props = [
            farm
        ]
        this.items = [
            ...items
        ]
        this.behaviors = {}

        document.body.appendChild(this.addhtml())
        this.update()
    }

    update() {
        this.name.innerHTML = `Lv.${this.stats.level}
        ${this.stats.name} ${'✪'.repeat(Math.floor(this.stats.rank/6))+'★'.repeat(this.stats.rank%6)}`
        this.driv.innerHTML = ''

        this.props.forEach(o => {
            if (o.disp) {
                this.driv.appendChild(reac(o.disp))
            }
        });

        this.items.forEach(o => {
            if (o.disp) {
                this.driv.appendChild(reac(o.disp))
            }
        });


        this.props.forEach(e => {
            e.updates(this)
        });

        this.items.forEach(e => {
            e.updates(this)
        });
    }

    dailyUpdate() {
        this.props.forEach(e => {
            e.daily(this)
        });
        this.items.forEach(e => {
            e.daily(this)
        });
        this.update()
    }

    upgrade() {
        var we = true //wealth
        for (const t in this.stats.upcost) {
            if (resources[t]<this.stats.upcost[t]) {
                we = false
            }
        }

        if (we) {
            for (const t in this.stats.upcost) {
                resources[t] -= this.stats.upcost[t]
            }

            if (this.stats.rankup) {
                this.stats.rank+=1;
                this.stats.level=0;
                this.stats.rankup=false;
                this.props.forEach(o => {o.onrank(this)});
            } else {
                this.stats.level+=1
                this.props.forEach(o => {o.onlevel(this)});
            }
            this.update()
            res()
        }
    }

    addhtml() {    
        //structure div
        this.stiv = document.createElement("stiv") 

        //basic info div
        this.biiv = document.createElement("biiv")
        this.name = document.createElement("span")

        //drop down div
        this.driv = reac(`
        <driv style="display: none;"></driv>
        `)

        //drop down button
        this.drutton = reac(`
        <drutton>+</drutton>
        `)

        //upgrade button
        this.uutton = reac(`<uutton class="hover">↑</uutton>`)

        this.upcost = reac(`
        <span class="hover-info">
            a
        </span>
        `)

        this.uutton.appendChild(this.upcost)
        this.uutton.onclick = this.upgrade.bind(this)

        this.drutton.onclick = function () {
            if (this.driv.style.display == 'block') {
                this.driv.style.display = 'none'
                this.drutton.innerHTML="+"
            } else {
                this.driv.style.display = "block"
                this.drutton.innerHTML="−"
            }
        }.bind(this)

        this.update()
        this.stiv.appendChild(this.biiv)
        this.biiv.appendChild(this.name)
        this.biiv.appendChild(this.uutton)
        this.biiv.appendChild(this.drutton)
        this.stiv.appendChild(this.driv)

        return this.stiv
    }
}

function passDay() {
    land.forEach(struct => {
        struct.dailyUpdate();
    });
    res();
}

function reac(str) {
    let a = document.createElement("a");
    a.innerHTML = str;
    return a.firstElementChild;
}

let land = [
    new structure({},[]),
    new structure({},[])]
