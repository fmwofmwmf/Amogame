const display = {
    HTML:null,
    remove:e=>{
        this.HTML.style.display = 'none'
    },
    set add(o) {
        this.HTML.innerHTML = ''
        this.HTML.appendChild(o)
        this.HTML.style.display = 'block'
    },
}