import { data } from "./data.js"
import { toMinAndSec } from "./utils.js"

const AudioController = {
    state: {
        audios: [],
        current: {},
        playing: false,
    },
    init() {
        this.initVariables()
        this.renderAudios()
        this.initEvents()
    },

    renderItem({id, link, track, group, genre, duration}) {
        const [image] = link.split('.')
        return `<div class="item" data-id="${id}">
        <div class="item-image" style="background-image: url('./assets/images/${image}.jpg');"></div>

        <div class="item-titles">
            <h2 class="item-group">${group}</h2>
            <h3 class="item-track">${track}</h3>
        </div>

        <p class="item-duration">${toMinAndSec(duration)}</p>
        <p class="item-genre">${genre}</p>
        <button class="item-play">
            <svg class="icon-play">
                <use xlink:href="./assets/images/sprite.svg#play"></use>
            </svg>
        </button>
    </div>`
    },

    loadAudioData(audio) {
        this.audiolist.innerHTML += this.renderItem(audio)
    },

    initVariables() {
        this.playButton = null
        this.audiolist = document.querySelector('.items')
        this.currentItem = document.querySelector('.current')
    },

    initEvents() {
        this.audiolist.addEventListener('click', this.handleItem.bind(this))
    },

    handleAudioPlay() {
        const { playing, current } = this.state
        const { audio } = current

        !playing ? audio.play() : audio.pause()
        
        this.state.playing = !playing
        this.playButton.classList.toggle('playing', !playing)
    },

    handleNext() {
        
    },

    handlePrev() {

    },

    handlePlayer() {
        const play = document.querySelector('.controls-play')
        const next = document.querySelector('.controls-next')
        const prev = document.querySelector('.controls-prev')

        this.playButton = play
        play.addEventListener('click', this.handleAudioPlay.bind(this))
        next.addEventListener('click', this.handleNext.bind(this))
        prev.addEventListener('click', this.handlePrev.bind(this))
    },

    audioUpdateHandler({audio, duration}) {
        const progress = document.querySelector('.progress-current')
        const timeline = document.querySelector('.timeline-start')

        audio.play()
        audio.addEventListener('timeupdate', ({target}) => {
            const { currentTime } = target
            const width = currentTime * 100 / duration

            timeline.innerHTML = toMinAndSec(currentTime)
            progress.style.width = `${width}%`
        })
    },

    renderCurrentItem({link, track, group, genre, duration, year}) {
        const [image] = link.split('.')
        return `<div class="current-image" style="background-image: url('./assets/images/${image}.jpg');"></div>

                    <div class="current-info">
                        <div class="current-info__top">
                            <div class="current-info__titles">
                                <h2 class="current-info__group">${group}</h2>
                                <h3 class="current-info__track">${track}</h3>
                            </div>

                            <div class="current-info__year">${year}</div>
                        </div>

                        <div class="controls">
                            <div class="controls-buttons">
                                <button class="controls-button controls-prev">
                                    <svg class="icon-arrow">
                                        <use xlink:href="./assets/images/sprite.svg#arrow"></use>
                                    </svg>
                                </button>

                                <button class="controls-button controls-play playing">
                                    <svg class="icon-pause">
                                        <use xlink:href="./assets/images/sprite.svg#pause"></use>
                                    </svg>
                                    <svg class="icon-play">
                                        <use xlink:href="./assets/images/sprite.svg#play"></use>
                                    </svg>
                                </button>

                                <button class="controls-button controls-next">
                                    <svg class="icon-arrow">
                                        <use xlink:href="./assets/images/sprite.svg#arrow"></use>
                                    </svg>
                                </button>
                            </div>

                            <div class="controls-progress">
                                <div class="progress">
                                    <div class="progress-current"></div>
                                </div>

                                <div class="timeline">
                                    <span class="timeline-start">00:00</span>
                                    <span class="timeline-end">${toMinAndSec(duration)}</span>
                                </div>
                            </div>
                        </div>
                </div>`
    },

    setCurrentItem(itemId) {
        const current = this.state.audios.find(({id}) => +id === +itemId)
        
        if(!current) return

        this.state.current = current
        this.currentItem.innerHTML = this.renderCurrentItem(current)
        this.handlePlayer()
        this.audioUpdateHandler(current)
    },

    handleItem( {target} ) {
        const { id } = target.dataset

        if(!id) return

        this.setCurrentItem(id)
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