const c_to_t = [0, 10, 15, 20, 30, 40, 50, 65, 80, 90, 100]
const tiers = [
    'C',
    'UC', 
    'R', 
    'SR', 
    'SSR', 
    'SSSR', 
    'UR', 
    'UUR', 
    'Exo', 
    'Myth'
]
const names = [
    'luffy', 
    'boruto', 
    'sanji', 
    'naruto', 
    'toruto', 
    'boruto', 
    'luffy from one piece', 
    'craig dreammask',
    'daniel dreammask',
    'vincent dreammask',
    'william dreammask',
]
const tnames = [
    'div',
    'biv',
    'tiv',
    'riv',
    'niv',
    'giv',
    'wiv'
]
const snames = [
    'rectangle city',
    'circle city',
    'triangle city',
    'hexagon city',
    'cube town',
    'octahedron town',
    'icosahedron town',
    'town from one piece'

]
const borders = ['black', 'grey', 'yellow', 'gold', 'red'];
const grades = ['F', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

const rarity = [50,20,10,5,3,2,1,0.5,0.05, 0]

const box_tile_odd = [
//   C   UC  R   SR  SSR S3R UR  UUR Exo M
    [70, 20, 9.9999,  0,  0,  0,  0,  0,  0,  0.0001], //F
    [50, 30, 15, 5,  0,  0,  0,  0,  0,  0], //D
    [30, 35, 20, 10, 5,  0,  0,  0,  0,  0], //C
    [15, 20, 30, 20, 10, 5,  0,  0,  0,  0], //B
    [0,  15, 20, 30, 20, 10, 5,  0,  0,  0], //A
    [0,  0,  15, 20, 30, 20, 10, 5,  0,  0], //S
    [0,  0,  0,  15, 20, 30, 20, 13, 2,  0], //SS
    [0,  0,  0,  0,  15, 20, 30, 28, 5,  2]  //SSS
]

const funs = {
    'structure':{
        'power':[
            {
                name:'Windmill',
                level:1,
                func:(c, s)=>{
                    const out = gen_connect([0, 0, s.main.area.w, s.main.area.h],
                        c, e=>{return s.up('b').map[e[0]][e[1]]==s.up('b').map[c[0]][c[1]] &&
                            s.main.area.map[e[0]][e[1]].c!=0}).length
                    return {'energy':out}
                },
                upcost:(c)=>{return {'energy':10*c.data.level}}
            }, 
            {
                name:'Big Windmill',
                level:1,
                func:(c, s)=>{
                    const out = gen_connect([0, 0, s.main.area.w, s.main.area.h],
                        c, e=>{return s.up('b').map[e[0]][e[1]]==s.up('b').map[c[0]][c[1]] &&
                            s.main.area.map[e[0]][e[1]].c!=0}).length*2
                    return {'food':out}
                },
                upcost:(c)=>{return {'energy':15*c.data.level}}
            }, 
        ],
        'wood':[

        ],

    },
    'mod-t':{},
    'mod-s':{},
    'branch':{
        '2-fork':[
            ,{
                name:'fork',
                level:1,
                func:e=>{},
                init:(c)=>{return new CardHolder(c, grade_r = 0)}
            },
            {
                name:'forkk',
                level:1,
                func:e=>{},
                init:(c)=>{return new CardHolder(c, grade_r = 1)}
            },
        ]
    },
}

const colors = ['lightGrey', 'lightGreen', 'cornsilk', 'darkSeaGreen', 'LawnGreen']
const biomenames = ['nope', 'plains', 'desert', 'forest', 'green place']

function round(num, dig) {
    return Math.round(num * Math.pow(10,dig)) / Math.pow(10, dig)
}
/*
do this
cohesion
mini game - filling stuff , puzzle
runes orbs
card tree!
PATH ROAD ENERGY
*/





