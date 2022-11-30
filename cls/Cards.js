/**
 * types: struct, rune, mod, 
 */
class Card {
    constructor(type, subtype, tier) {
        this.type = type;
        this.stype = subtype;
        this.tier = tier;
        this.data = {
            ...funs[type][subtype][tier]
        }
    }

    upgrade() {
        console.log(this.data)
        const cost = this.data.upcost(this)
        if (eco.enough(cost)) {
            this.data.level ++;
            eco.sub = cost
            return true
        }
        return false
    }

    getInfo() {
        return `${grades[this.tier]} ${this.data.name} Lv.${this.data.level}`
    }
}

class CardHolder {
    /**
     * 
     * @param {*} type_r accepted types
     * @param {*} grade_r max grade
     */
    constructor(cont, type_r=[], grade_r=null, unlock=null) {
        this.container = cont;
        this.restrictions = {
            type:type_r,
            grade:grade_r,
            unlock:unlock?unlock:e=>{return true}
        }
        this.card = null
        this.open = false
        this.tryunlock()
        this.makeInfoCard()
    }

    tryunlock() {
        if (this.restrictions.unlock(this.container)) {
            this.open = true;
        }
    }

    typeCheck(t) {
        let ok = false;
        if (this.restrictions.type.length == 0) {
            console.log('f')
            return true;
        }
        this.restrictions.type.forEach(tp => {
            if (t == tp) {
                ok = true
            }
        });
        return ok
    }

    tryadd(e) {
        console.log(this.card, '1')
        if (!this.typeCheck(e.type)) {
            return;
        }
        if (this.card!=null) {
            inv.add_card = this.card
        }
        this.card = e
        console.log(this.card, '2', inv.cards)
        inv.rem_card = this.card
        console.log(this.card, '3', inv.cards)
        this.display()
    }

    makeInfoCard() {
        this.info = document.createElement('div')
        this.info.addEventListener('click', e=>{
            if (this.card) {
                inv.add_card = this.card
                this.card = null;
                this.info.classList += 'nocard '
                this.info.innerHTML =  ''
            }
        })
        this.tooltip = new Tooltip(this.info)
        this.tooltip.addTitle('CARD')
        this.tooltip.addVar(()=>this.card? this.card.getInfo():'nothing')
    }

    display() {
        this.info.classList = 'card '
        this.info.innerHTML = ''
        if (!this.open) {
            this.info.classList += 'lockcard '
        } else {
            if (this.card == null) {
                this.info.classList += 'nocard '
            }
        }
        
        return this.info
    }
}