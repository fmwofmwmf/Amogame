const anchor = document.getElementById('tooltip_anchor')

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
            anchor.innerHTML = ''
            this.content.forEach(c => {
                if (c.update) {
                    c.update()
                }
                anchor.appendChild(c.node)
            });
            anchor.style.display = 'block'
            const b = this.root.getBoundingClientRect()
            const t = anchor.getBoundingClientRect()
            const pos_top = b.top + b.height / 2 - t.height / 2
            switch (this.align) {
                //top right bot left
                case 'right':
                    anchor.style.inset = `${pos_top}px auto auto ${b.right}px`
                    anchor.style.marginLeft = "5px"
                    break;
                case 'left':
                    anchor.style.inset = `${pos_top}px auto auto ${b.left-(t.right-t.left)}px`
                    anchor.style.marginRight = "5px"
                    break;
                case 'bot':
            
                    break;
                default:
                    break;
            }
            
        })
        this.root.addEventListener('mouseout', e=>{
            anchor.style.display = 'none'
        })
    }
}