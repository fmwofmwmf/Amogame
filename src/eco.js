
let eco = {
    res: {
        'wood':0,
        'stone':0,
        'energy':0,
        "grain":0,
        'food':0,
        "brick":0,
        'green octagon':0,
        "bomb":0,
        "livestock":0,
        "cloth":0,
        "oil":0,
        "orange diamond":0,
    },
    icon: {
        'wood': "🪵",
        'stone':"🪨",
        'energy': "⚡",
        "grain": "🌾",
        'food': "🍖",
        'brick': "🧱",
        'green octagon': "💎",
        "bomb":"💣",
        "livestock": "🐮",
        "cloth":"🧶",
        "oil":"🛢",
        "orange diamond":"🔶",
    },
    reset() {
        this.res = {
            'wood':0,
            'stone':0,
            'energy':0,
            "grain":0,
            'food':0,
            "brick":0,
            'green octagon':0,
            "bomb":0,
            "livestock":0,
            "cloth":0,
            "oil":0,
            "orange diamond":0,
        }
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
    parse_num(num){
        const thousand = 1000
        const million = 1000000
        const billion = 1000000000
        const trillion = 1000000000000
        const quadrillion = 1000000000000000
        if(num < 10*thousand){
            return num
        }
        else if (num < million){
            return ((num / thousand).toString().slice(0,4).replace(/^\.+|\.+$/g, '') + "k")
        }
        else if (num < billion){
            return ((num / million).toString().slice(0,4).replace(/^\.+|\.+$/g, '') + "M")
        }
        else if (num < trillion){
            return ((num / billion).toString().slice(0,4).replace(/^\.+|\.+$/g, '') + "B")
        }
        else if (num < quadrillion){
            return ((num / trillion).toString().slice(0,4).replace(/^\.+|\.+$/g, '') + "T")
        }
        return "big num"
    },
    updateRes(res = this.res) {
        this.disp.innerHTML = ''
        for (const k in res) {
            let s = document.createElement('p')
            s.classList += "resource-item"
            s.innerHTML = `${this.parse_num(res[k])} <br> ${this.icon[k]}`
            this.disp.appendChild(s)
        }
    }
}

function stringy(ob, pre='') {
    let a = []
    for (const k in ob) {
        if (ob[k]>0) {
            a.push(`${k}: ${pre}${ob[k]}`)
        }
    }
    let str = ''
    for (let i = 0; i < a.length; i++) {
        str+=a[i];
        if (i!=a.length-1) {
            str+='<br>'
        }
    }
    return str
}

eco.disp = document.getElementById('resource')
eco.updateRes()