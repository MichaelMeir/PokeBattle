const req = {
    post: (url = '/', func = (req) => {}, params = {}, headers = {}, async = false) => {
        perform(url, func, params, headers, async, 'post')
    },
    get: (url = '/', params = {}, headers = {}, async = false) => {
        perform(url, func, params, headers, async, 'get')
    },
    perform(url = '/', params = {}, headers = {}, async = false, method = 'get') {
        var req = new XMLHttpRequest();
        for(let i = 0; i < Object.keys(headers); i++) {
            req.setRequestHeader(Object.keys(headers)[i], headers[Object.keys(headers)[i]])
        }
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                func(this)
            }
        };
        req.open(method, url, true);
        req.send(params)
    }
}

/**
 *  @class LiveText
 *  @description Provides which updates text live as you change the values in its data
 * 
 *  @param {element} element Dom element which should be made live
 *  @param {string} src_value source value of the text, as 'hello {{ value }}'
 *  @param {object} data json object with all the data in it, as '{"value": "there"}'
 */
class LiveText {
    constructor(element, src_value, data) {
        this.element = element
        data.__src = src_value
        this.src_data = data
        this.data = new Proxy(this.src_data, {
            set: this.update
        })
        this.data.__element = element
    }

    update(target, prop, value) {
        let output = Reflect.set(target, prop, value)
        console.log(target)
        let keys = Object.keys(target)
        let out = target.__src
        for(let i = 0; i < keys.length; i++) {
            out = out.replace('{{ ' + keys[i] + ' }}', target[keys[i]])
        }
        target.__element.innerHTML = out
        return output
    }
}

let texts = []

/**
 * @function
 * @name initLiveTexts
 * @description gets out all 'live-text' elements in the document and changes them into LiveTexts
 */
function initLiveTexts() {
    let textsSrc = document.getElementsByTagName('live-text')
    for(let i = textsSrc.length-1; i >= 0; i--) {
        let type = textsSrc[i].getAttribute('type') ? textsSrc[i].getAttribute('type') : 'p'
        let data = textsSrc[i].getAttribute('data') ? textsSrc[i].getAttribute('data') : '{}'

        let element = document.createElement(type)
        let obj = new LiveText(element, textsSrc[i].innerHTML, JSON.parse(data));
        element.id = textsSrc[i].id
        element.classList = textsSrc[i].classList
        textsSrc[i].parentElement.replaceChild(element, textsSrc[i])
        texts.push(obj)
        textsSrc = document.getElementsByTagName('live-text')
    }
}

/**
 * @functions
 * @name getLiveTextById
 * @description returns a live text object from the 'texts' array
 * 
 * @param {string} id 
 * 
 * @returns {LiveText} 
 */
function getLiveTextById(id) {
    for(let i = 0; i < texts.length; i++) {
        if(texts[i].element.id == id) {
            return texts[i]
        }
    }
    return null
}

window.onload = () => {
    initLiveTexts()
}

const ownPokemon = getElement('ownPokemon')
const enemyPokemon = getElement('enemyPokemon')

/**
 * @name getElement
 * @description smaller method so its faster to get an element
 * 
 * @param {string} id
 * 
 * @returns {object} element of given id 
 */
function getElement(id) {
    return document.getElementById(id)
}