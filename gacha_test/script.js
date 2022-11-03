const inv = document.getElementById('inv')
const gac = document.getElementById('gacha')
var chara = [
    {
        name:'sanji',
        border:'gold',
        stars:10,
        tier:3,
        rank:2,

    },
    
]

function ran(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

gac.addEventListener('click', function () {
    chara.push({
        name:names[ran(0,names.length)],
        border:'red',
        stars:ran(1,50),
        tier:ran(0,ranks.length),
        rank:ran(0,6)
    })
    plot()
})

const ranks = ['F', 'C', 'UC', 'R', 'SR', 'SSR', 'SSSR', 'UR', 'UUR', 'E', 'L', 'Myth']
const names = ['luffy', 'boruto', 'sanji', 'naruto', 'toruto', 'boruto', 'luffy from one piece']

function plot(){
    inv.innerHTML=''
    for (let i = 0; i < chara.length; i++) {
        const e = chara[i];
        s = `${'✶'.repeat(Math.floor(e.stars/25))}${'★'.repeat(Math.floor(e.stars/5)%5)}${'✦'.repeat(e.stars%5)}`
        inv.appendChild(reac(`<div class='card' style='border-color:${e.border};'>${e.name}</br>${s}
        </br>${ranks[e.tier]}${'+'.repeat(e.rank)}
        </div>`))
        console.log(e.stars)
    }
}

function reac(str) {
    let a = document.createElement("a");
    a.innerHTML = str;
    return a.firstElementChild;
}

plot()