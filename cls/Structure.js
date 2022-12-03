class Struc {
    c = 3;
    main = null;
    grade;
    e_grade = 0;
    base_stats = {
        max_paths:3,
        eff:1};
    paths = []
    temp_inv = {income:[],p_out:[],p_in:[]}
    /**
     * 
     * @param {string} e type
     * @param {number} b biome
     */
    constructor(e, pos, n = snames) {
        this.b = b;
        this.cpos = pos;
        this.cards = [new CardHolder(this, ['structure']), new CardHolder(this, ['branch', 'mod-s']), new CardHolder(this, ['branch', 'mod-s'])]
        this.growth = randint(-2,3);
        this.name = snames[randint(0, n.length)];
        this.type = e;
        this.maxRes = {
            energy:[10],
            food:[10],
        }
        this.inv = Object.create(eco)
        this.inv.res = Object.create(eco.res)
        
        this.makeInfoCard()
    }

    get coord() {
        return [this.cpos[0]+this.main.global[0]+this.main.center[0],
        this.cpos[1]+this.main.global[1]+this.main.center[1]]
    }

    bindMain(tile) {
        this.main = tile;
        this.grade = this.main.tier;
    }

    getUpgrade() {
        return {
            'wood':(this.level)*2,
            'stone':(this.level),
            'energy':0,
            'food':0
        }
    }

    /**
     * 
     * @param {string} str t for tile, m for area, b for biome
     * @returns
     */
    up(str) {
        switch (str) {
            case 't':
               return this.main
            case 'm':
               return this.main.area
            case 'b':
               return this.main.area.biome_map
            case 'p':
                return this.main.area.path_map
            default:
                break;
        }
    }

    upgrade() {
        this.grade++;
        this.e_grade += this.growth;
    }

    efficency() {
        let ef = 1*this.up('t').efficency()
        if (this.inv.res.food==0 && this.maxRes.food!=0) {
            ef*=0.7
        }
        if (this.inv.res.energy==0 && this.maxRes.energy!=0) {
            ef*=0.7
        }
        return round(ef, 2)
    }

    scaleEco(ob, ef) {
        let newec = {}
        for (const k in ob) {
            newec[k] = Math.ceil(ob[k]*ef)
        }
        return newec
    }

    splitEco(ob, am, count) {
        let n = []
        for (let i = 0; i < count; i++) {
            n[i] = {}
        }
        for (const k in ob) {
            n.forEach(e => {
                e[k] = Math.floor(ob[k]*am)
            });
            ob[k] = Math.ceil(ob[k]*(1-am*count))
        }
        return n
    }

    maxIncome() {
        let out = {}
        for (const r in this.maxRes) {
            if (this.inv.res[r]>this.maxRes[r][0]) {
                out[r] = this.inv.res[r]-this.maxRes[r][0]
                this.inv.res[r]=this.maxRes[r][0]
            }
            this.maxRes[r][1].value = this.inv.res[r]
        }
        return out
    }

    income_stage_1() {
        this.temp_inv = {income:[],p_out:[],p_in:[]}
        const ef = this.efficency()
        if (this.cards[0].card) {
            let inc = this.cards[0].card.data.func(this.coord, this)
            inc = this.scaleEco(inc, ef)
            this.inv.add = inc
            this.temp_inv.income.push(inc)
            this.inv.updateRes(inc)
        }
    }

    income_stage_2() {
        let outputs = []
        this.paths.forEach(path => {
            if (path.from==this) {
                outputs.push(path)
            }
        });
        const split = this.splitEco(this.inv.res, 0.1, outputs.length)
        for (let i = 0; i < outputs.length; i++) {
            this.temp_inv.p_out.push(split[i])
            outputs[i].package = split[i]
        }
    }

    income_stage_3() {
        this.paths.forEach(path => {
            if (path.to==this) {
                this.temp_inv.p_in.push(path.package)
                this.inv.add = path.package
            }
        });
        return this.maxIncome()
    }

    makeInfoCard() {
        this.info = document.createElement('div')
        this.info.className = 'info-card'
        this.structCard = document.createElement('div')
        this.modCards = document.createElement('div')
        this.structCard.className = 'struct-info-main'
        this.text = document.createElement('div')

        this.incomeCont = document.createElement('div')
        new Tooltip(this.incomeCont, 'bottom')
        .addVar(()=>`Efficency: ${this.efficency()*100}%`)
        .addTitle('income:')
        .addList(()=>this.temp_inv.income, (s)=>stringy(s, '+'), 'none')
        .addTitle('out:')
        .addList(()=>this.temp_inv.p_out, (s)=>stringy(s, '-'), 'none')
        .addTitle('in:')
        .addList(()=>this.temp_inv.p_in, (s)=>stringy(s, '+'), 'none')

        this.incomeCont.className = 'income-cont'
        this.inv.disp = document.createElement('div')

        this.info.appendChild(this.text)
        this.info.appendChild(this.incomeCont)
        this.info.appendChild(this.structCard)
        this.info.appendChild(this.modCards)

        for (const r in this.maxRes) {
            const p = document.createElement('progress')
            p.className = 'struct-progress'
            this.maxRes[r][1] = p;
            p.value=0
            p.max=this.maxRes[r][0]
            this.info.appendChild(p)
            new Tooltip(p).addVar(()=>`${this.inv.res[r]}/${this.maxRes[r][0]}`)
        }

    }

    getInfoCard() {
        let c = ''
        if (this.e_grade>0) {
            c = '+'+this.e_grade
        } else if (this.e_grade<0) {
            c = this.e_grade
        }

        this.text.innerHTML = `[${grades[this.grade]}${c}] ${this.name} ${this.growth>=0? '+'+this.growth:this.growth}`
        this.incomeCont.innerHTML =`ecoo`
        this.structCard.innerHTML = ''
        this.modCards.innerHTML = ''
        this.structCard.appendChild(this.cards[0].display())
        for (let i = 1; i < this.cards.length; i++) {
            const c = this.cards[i];
            this.modCards.appendChild(c.display())
        }
        return this.info
    }

    getPathCard() {
        const inf = document.createElement('div')
        inf.innerHTML = `[${this.name}] Paths`
        this.paths.forEach(p => {
            const d = document.createElement('div')
            if (p.from==this) {
                d.innerHTML = `[${this.name}] ⟶ (${p.to.name}) :)`
            } else {
                d.innerHTML = `(${p.from.name}) ⟶ [${this.name}] :)`
            }
            const b = document.createElement('div')
            b.classList = 'button'
            b.innerHTML = '-'
            b.addEventListener('click', e=>{
                d.remove()
                this.up('p').remove = p
            })
            d.appendChild(b)
            inf.appendChild(d)
        });
        return inf
    }
}