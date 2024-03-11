import { data } from "./data.js"

const AudioController = {
    state: {
        audios: [],
    },
    init() {
        this.initVariables()
        this.renderAudios()
    },

    loadAudioData(audio) {
        
    },

    initVariables() {
        this.audiolist = document.querySelector('.items')
    },

    renderAudios() {
        data.forEach(item => {
            const audio = new Audio(`./assets/audio/${item.link}`)
            
            audio.addEventListener("loadeddata", () => {
                const newItem = {...item, duration: audio.duration, audio}
                this.state.audios = [...this.state.audios, newItem]
                this.loadAudioData(newItem)
            })
        });
    }
}

AudioController.init()