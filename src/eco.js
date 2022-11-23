const resources = document.getElementById('money')

let eco = {
    'wood':0,
    'stone':0,
    'energy':0,
    'food':0,
}

function updateRes() {
    resources.innerHTML = ''
    for (const k in eco) {
        let s = document.createElement('p')
        s.classList += "resource"
        s.innerHTML = `${k}: ${eco[k]} `
        resources.appendChild(s)
    }
}
updateRes()

function addeco(ob) {
    for (const k in ob) {
        eco[k] += ob[k]
    }
    updateRes();
}