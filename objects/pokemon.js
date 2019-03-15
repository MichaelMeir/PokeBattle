const fs = require('fs')
const actions = require('./actions')
const types = require('./types')

actions.DynamicActionClassGenerator(JSON.parse(fs.readFileSync('./data/skills.json', 'utf8')))
types.DynamicTypeClassGenerator(JSON.parse(fs.readFileSync('./data/types.json', 'utf8')))

class Pokemon {
    constructor(id = -1, name = '', level = 0, exp = 0, type = [], hp = 100, atk = 20, def = 20, sp_atk = 30, sp_def = 30, spd = 50, actions = []) {
        this.id = id
        this.base_name = name
        this.name = name
        this.type = type
        this.level = level
        this.exp = exp
        this.default_stats = {
            'HP': hp,
            'ATTACK': atk,
            'DEFENSE': def,
            'SP. ATTACK': sp_atk,
            'SP. DEFENSE': sp_def,
            'SPEED': spd
        }
        this.stats = {
            'HP': hp,
            'ATTACK': atk,
            'DEFENSE': def,
            'SP. ATTACK': sp_atk,
            'SP. DEFENSE': sp_def,
            'SPEED': spd
        }
        this.actions = actions
    }

    /** 
     * @function
     * @name getImage
     * @description returns an image link corresponding to the pokemon id+baseName
     * 
     * @returns {string} image link
     */
    getImage() {
        return '/static/images/pokemon/normal/' + ("00" + this.id).slice(-3) + this.base_name.charAt(0).toUpperCase() + this.base_name.slice(1) + '.png'
    }

    /** 
     * @function
     * @name getPixelImage
     * @description returns an pixel image link corresponding to the pokemon id
     * 
     * @returns {string} pixel image link
     */
    getPixelImage() {
        return '/static/images/pokemon/pixel/' + ("00" + this.id).slice(-3) + 'MS.png'
    }

    damage(skill) {
        let multiplier = getTypeMultiplier(skill)
        this.hp -= (skill.power * multiplier)
        return multiplier
    }

    getTypeMultiplier(skill) {
        if(types[this.type] != null) {
            let type = new types[this.type]()
            for(let i = 0; i < type.weaknesses; i++) {
                if(type.weaknesses[i] == skill.type) {
                    return 1.5
                }
            }
            for(let i = 0; i < type.strengths; i++) {
                if(type.strengths[i] == skill.type) {
                    return 0.5
                }
            }
            for(let i = 0; i < type.immune; i++) {
                if(type.immune[i] == skill.type) {
                    return 0
                }
            }
        }
        return 1
    }
}

exports.Pokemon = Pokemon

/** 
 *  @function
 *  @name DynamicPokemonClassifier
 *  @description dynamically converts json data to pokemon classes
 * 
 *  @param {array} data
 */
exports.DynamicPokemonClassGenerator = function (data = []) {
    for(let i = 0; i < data.length; i++) {
        let pokemon = data[i]
        let C = class extends Pokemon {
            constructor(display_name = '', actions = [], level = 0, xp = 0) {
                super(pokemon.id, pokemon.name.english, level, xp, pokemon.type, 
                    pokemon.base['HP'], 
                    pokemon.base['Attack'], 
                    pokemon.base['Defense'], 
                    pokemon.base['Sp. Attack'], 
                    pokemon.base['Sp. Defense'], 
                    pokemon.base['Speed'],
                    actions)
                    this.display_name = display_name
            }
        }
        let name = pokemon.name.english.charAt(0).toUpperCase() + pokemon.name.english.slice(1)
        Object.defineProperty(C, 'name', {value: name});
        exports[name] = C
    }
}