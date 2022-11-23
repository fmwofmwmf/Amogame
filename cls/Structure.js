class Struc {
    /**
     * 
     * @param {string} e type
     * @param {number} b biome
     */
    constructor(e, pos, n = snames) {
        this.c = 3;
        this.b = b;
        this.cpos = pos;
        this.income = 0;
        this.cards = [new CardHolder(this, ['structure']), new CardHolder(this, ['branch', 'mod-s']), new CardHolder(this, ['branch', 'mod-s'])]
        this.growth = randint(-2,3);
        this.name = snames[randint(0, n.length)];
        this.grade;
        this.e_grade = 0;
        this.main = null;
        this.type = e;
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

    getIncome() {
        if (this.cards[0].card) {
            const c = [this.cpos[0]+this.main.global[0]+this.main.center[0],
            this.cpos[1]+this.main.global[1]+this.main.center[1]]

            return this.cards[0].card.data.func(c, this)
        }
        return {}
    }

    getInfoCard(pos) {
        const siv = document.createElement('div')
        siv.style.textAlign = 'center'

        let c = ''
        if (this.e_grade>0) {
            c = '+'+this.e_grade
        } else if (this.e_grade<0) {
            c = this.e_grade
        }

        siv.innerHTML = `[${grades[this.grade]}${c}] ${this.name} ${this.growth>=0? '+'+this.growth:this.growth}`

        const up = document.createElement('div')

        up.innerHTML = 'up'
        up.addEventListener('click', ()=>{
            this.upgrade();
            add_struct_info(this, pos, this.up('m'));
        })

        siv.appendChild(up)

        const m = document.createElement('div')
        m.appendChild(this.cards[0].display())
        m.className = 'struct-info-main'
        siv.appendChild(m)
        for (let i = 1; i < this.cards.length; i++) {
            const c = this.cards[i];
            siv.appendChild(c.display())   
        }

        return siv
    }
}