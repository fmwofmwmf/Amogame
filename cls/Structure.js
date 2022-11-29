class Struc {
    c = 3;
    main = null;
    grade;
    e_grade = 0;
    base_stats = {max_paths:3};
    paths = []
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
        
            default:
                break;
        }
    }

    upgrade() {
        this.grade++;
        this.e_grade += this.growth;
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

    getIncome() {
        if (this.cards[0].card) {
            const inc = this.cards[0].card.data.func(this.coord, this)
            this.inv.add = inc
            this.inv.updateRes(inc)
        }
        return this.maxIncome()
    }

    makeInfoCard() {
        this.info = document.createElement('div')
        this.info.style.textAlign = 'center'
        this.structCard = document.createElement('div')
        this.modCards = document.createElement('div')
        this.structCard.className = 'struct-info-main'
        this.text = document.createElement('div')
        this.income = document.createElement('div')

        this.inv.disp = this.income

        this.info.appendChild(this.text)
        this.info.appendChild(this.income)
        this.info.appendChild(this.structCard)
        this.info.appendChild(this.modCards)

        for (const r in this.maxRes) {
            const p = document.createElement('progress')
            p.className = 'struct-progress'
            this.maxRes[r][1] = p;
            p.value=0
            p.max=this.maxRes[r][0]
            this.info.appendChild(p)
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
        this.paths.forEach(p => {
            const d = document.createElement('div')
            d.innerHTML = 'a path :)'
            inf.appendChild(d)
        });
        return inf
    }
}