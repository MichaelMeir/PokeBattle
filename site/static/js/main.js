const req = {
	post: (url = "/", func = req => {}, params = {}, async = true) => {
        let request = req.perform(func);
        request.open('post', url, async);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify(params));
	},
	get: (url = "/", func = req => {}, params = {}, async = true) => {
        let request = req.perform(func);
        request.open('get', url, async);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        let parameters = [];
		for (let i = 0; i < Object.keys(params).length; i++) {
			parameters.push(
				Object.keys(params)[i] + "=" + params[Object.keys(params)[i]]
			);
		}
        request.send(parameters.join('&'));
	},
	perform: (func) => {
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				try {
					this.data = JSON.parse(this.responseText);
				} catch (e) {
					this.data = {};
				}
				func(this);
			}
        };
		return request
	}
};

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

let token = ""

window.onload = () => {
    initLiveTexts()
    token = JSON.parse(getCookie('user-token'))
    if(token == null) {
        window.location.replace("/");
    }
    getLiveTextById('token').data.token = token
    req.post('/fighting', (response) => {
        getLiveTextById('ownPokemonStr').data.name = response.data.pokemon.name
        getLiveTextById('ownPokemonStr').data.level = response.data.pokemon.level
        getLiveTextById('ownPokemonImage').data.image = response.data.image
        getElement('actions').innerHTML = ""
        for(let i = 0; i < response.data.pokemon.actions.length; i++) {
            let action = document.createElement('button')
            action.innerHTML = response.data.pokemon.actions[i].name
            action.onclick = () => {
                req.post('/useAction', (response) => {
                    getLiveTextById('ownPokemonStr').data.name = response.data.pokemon.name
                    getLiveTextById('ownPokemonStr').data.level = response.data.pokemon.level
                    getLiveTextById('ownPokemonImage').data.image = response.data.image
                    getElement('ownPokemon').style.width = response.data.pokemon.stats['HP'] <= 0 ? "0%" : Math.floor((response.data.pokemon.stats['HP'] / response.data.pokemon.default_stats['HP']) * 100) + "%"
                    getEnemyDetails()
                }, {
                    'token': token,
                    'i': i
                })
            }
            getElement('actions').appendChild(action)
        }
    }, {
        'token': token
    })
    getEnemyDetails()
    LoadPokemons()
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

/**
 * 
 */
function LoadPokemons() {
    req.post('/pokemons', (response) => {
        console.log(response.data)
        for(let i = 0; i < response.data.length; i++) {
            let element = document.createElement('img')
            element.classList.add('pokemon-index')
            element.onclick = () => {
                req.post('/swap', (response) => {
                    getLiveTextById('ownPokemonStr').data.name = response.data.pokemon.name
                    getLiveTextById('ownPokemonStr').data.level = response.data.pokemon.level
                    getLiveTextById('ownPokemonImage').data.image = response.data.image
                    getElement('ownPokemon').style.width = response.data.pokemon.stats['HP'] <= 0 ? "0%" : Math.floor((response.data.pokemon.stats['HP'] / response.data.pokemon.default_stats['HP']) * 100) + "%"
                    getElement('actions').innerHTML = ""
                    for(let i = 0; i < response.data.pokemon.actions.length; i++) {
                        let action = document.createElement('button')
                        action.innerHTML = response.data.pokemon.actions[i].name
                        action.onclick = () => {
                            req.post('/useAction', (response) => {
                                getLiveTextById('ownPokemonStr').data.name = response.data.pokemon.name
                                getLiveTextById('ownPokemonStr').data.level = response.data.pokemon.level
                                getLiveTextById('ownPokemonImage').data.image = response.data.image
                                getElement('ownPokemon').style.width = response.data.pokemon.stats['HP'] <= 0 ? "0%" : Math.floor((response.data.pokemon.stats['HP'] / response.data.pokemon.default_stats['HP']) * 100) + "%"
                            }, {
                                'token': token,
                                'actionIndex': i
                            })
                            getEnemyDetails()
                        }
                        getElement('actions').appendChild(action)
                    }
                }, {
                    'token': token,
                    'index': i
                })
            }
            element.setAttribute('src', response.data[i].pixel)
            getElement('pokemons').appendChild(element)
        }
    },
    {
        token: token,
    })
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return null;
}

function getEnemyDetails() {
    req.post('/enemyDetails', (response) => {
        getLiveTextById('enemyPokemonStr').data.name = response.data.pokemon.name
        getLiveTextById('enemyPokemonStr').data.level = response.data.pokemon.level
        getLiveTextById('enemyPokemonImage').data.image = response.data.image
        getElement('enemyPokemon').style.width = response.data.pokemon.stats['HP'] <= 0 ? "0%" : Math.floor((response.data.pokemon.stats['HP'] / response.data.pokemon.default_stats['HP']) * 100) + "%"
    }, {
        'token': token,
    })
}