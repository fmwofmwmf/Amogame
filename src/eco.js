let eco = {
    res: {
        'wood':0,
        'stone':0,
        'energy':0,
        'food':0
    },
    set add(obj) {
        for (const k in obj) {
            this.res[k] += obj[k]
        }
        this.updateRes()
    },
    set sub(obj) {
        for (const k in obj) {
            this.res[k] -= obj[k]
        }
        this.updateRes()
    },
    enough(obj) {
        for (const k in obj) {
            if (this.res[k] < obj[k])
            return false
        }
        return true
    },
    updateRes(res = this.res) {
        this.disp.innerHTML = ''
        for (const k in res) {
            let s = document.createElement('p')
            s.classList += "resource"
            s.innerHTML = `${k}: ${res[k]} `
            this.disp.appendChild(s)
        }
    }
    
}
eco.disp = document.getElementById('money')
eco.updateRes()