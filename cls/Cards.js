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
        this.disp = null
        this.tryunlock()
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
        if (!this.typeCheck(e.type)) {
            return;
        }
        if (this.card!=null) {
            inv.add_card = this.card
        }
        this.card = e
        inv.rem_card = this.card
        this.disp.classList = 'card tooltip '
        this.disp.children[0].innerHTML = `${this.card.getInfo()}`
    }

    display() {
        const civ = document.createElement('div')
        this.disp = civ
        civ.classList = 'card tooltip '
        
        if (!this.open) {
            civ.classList += 'lockcard '
        } else {
            const info = document.createElement('span')
            
            info.classList = 'cardhold-select'

            if (this.card == null) {
                civ.classList += 'nocard '
            } else {
                info.innerHTML = `${this.card.getInfo()}`
            }

            civ.addEventListener('click', e=>{
                inv.add_card = this.card
                this.card = null;
                civ.classList += 'nocard '
                info.innerHTML =  ''
            })

            // civ.addEventListener('drop', e=>{
            //     const t = e.dataTransfer.getData("type")
            //     if (!this.typeCheck(t)) {
            //         return;
            //     }
            //     const i = e.dataTransfer.getData("index")
            //     if (this.card!=null) {
            //         cinv.push(this.card)
            //     }
            //     this.card = cinv[i]
            //     cinv.splice(i, 1)
            //     display_cinv()
            //     civ.classList = 'card tooltip '
            //     info.innerHTML = `${this.card.getInfo()}`
            // })

            civ.appendChild(info)
        }
        
        return civ
    }
}