const funs = {
    'structure':{
        'power':[
            {
                name:'Windmill',
                level:1,
                function:e=>{},
            }, 
            {
                name:'Big Windmill',
                level:1,
                function:e=>{},
            }, 
        ],
        'wood':[

        ],

    },
    'modifier-t':{},
    'modifier-s':{},
    'branch':{
        '2-fork':{

        },
        '3-fork':{

        }
    },
}

/**
 * types: struct, rune, mod, 
 */
class Card {
    constructor(type, subtype, tier) {
        this.type = type;
        this.stype = subtype;
        this.tier = tier;
        this.data = funs[type][subtype][tier]
    }

    getInfo() {
        return `${grades[this.tier]} ${this.data.name}`
    }
}

class CardHolder {
    /**
     * 
     * @param {*} type_r accepted types
     * @param {*} grade_r min grade
     */
    constructor(cont, type_r=null, grade_r=null, unlock=null) {
        this.container = cont;
        this.restrictions = {
            type:type_r,
            grade:grade_r,
            unlock:unlock?unlock:e=>{return true}
        }
        this.card = null
        this.open = false
    }

    tryunlock() {
        if (this.unlock(this.container)) {
            this.open = true;
        }
    }

    display() {
        const civ = document.createElement('div')
        civ.classList = 'card '
        
        const info = document.createElement('span')
        info.innerHTML = `stuff<br>stuff`
        info.classList = 'cardinfo'
        if (!this.open) {
            civ.classList += 'lockcard '
            info.innerHTML = `not available yet`
        } else if (this.card == null) {
            civ.classList += 'nocard '
            info.innerHTML = `add a card`
        }
        civ.appendChild(info)
        return civ
    }
}