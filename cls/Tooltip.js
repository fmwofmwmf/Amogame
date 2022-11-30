const tt = document.getElementById('tooltipfr')
tt.style.backgroundColor = 'white'
tt.style.position = 'absolute';
tt.style.zIndex = 2
tt.style.pointerEvents = 'none'
tt.style.maxWidth = '20vw'
tt.style.wordBreak = 'break-word'

class Tooltip {
    content = []
    update = []

    constructor(main, align='right') {
        this.root = main
        this.align = align
        this.bind();
    }

    addTitle(text) {
        const title = document.createElement('div')
        title.innerHTML = text
        title.classList = 'tt-title'
        this.content.push({node:title})
        return this
    }

    addVar(func) {
        const viv = document.createElement('div')
        viv.classList = 'tt-var'
        this.content.push({node:viv, update:()=>{viv.innerHTML=func()}})
        return this
    }

    addList(func, str, def='') {
        const liv = document.createElement('div')
        liv.classList = 'tt-list'
        this.content.push({node:liv, update:()=>{
            liv.innerHTML=''
            const arr = func();
            if (arr.length!=0) {
                arr.forEach(e => {
                    liv.innerHTML += str(e) + '<br>'
                });
            } else {
                liv.innerHTML += def
            }
            
        }})
        return this
    }

    bind() {
        this.root.addEventListener('mouseover', e=>{
            tt.innerHTML = ''
            this.content.forEach(c => {
                if (c.update) {
                    c.update()
                }
                tt.appendChild(c.node)
            });

            const b = this.root.getBoundingClientRect()
            const t = tt.getBoundingClientRect()
            tt.style.display = 'block'
            switch (this.align) {
                //top right bot left
                case 'right':
                    tt.style.inset = `${b.top}px auto auto ${b.right}px`
                    break;
                case 'left':
                    tt.style.inset = `${b.top}px auto auto ${b.left-(t.right-t.left)}px`
                    break;
                case 'bot':
            
                    break;
                default:
                    break;
            }
            
        })
        this.root.addEventListener('mouseout', e=>{
            tt.style.display = 'none'
        })
    }
}