const fs = require('fs')
const actionsList = require('./actions')
const typesList = require('./types')

actionsList.DynamicActionClassGenerator(JSON.parse(fs.readFileSync('./data/skills.json', 'utf8')))
typesList.DynamicTypeClassGenerator(JSON.parse(fs.readFileSync('./data/types.json', 'utf8')))

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
        if(this.actions.length == 0) {
            do{
                this.actions.push(new actionsList.actions[Object.keys(actionsList.actions)[Math.floor(Math.random() * Object.keys(actionsList.actions).length)]]())
            }while(this.actions.length < 4 && Math.floor(Math.random() * 100) < 25)
        }
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
        let multiplier = this.getTypeMultiplier(skill)
        console.log(this.base_name + ' got damaged for ' + (skill.power * multiplier) + ' HP')
        this.stats['HP'] -= (skill.power * multiplier)
        console.log(this.base_name + ' got ' + this.stats['HP'] + ' HP left')
        return multiplier
    }

    getTypeMultiplier(skill) {
        if(typesList[this.type] != null) {
            let type = new typesList[this.type]()
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
// exports.DynamicPokemonClassGenerator = function (data = []) {
//     for(let i = 0; i < data.length; i++) {
//         let pokemon = data[i]
//         let C = class extends Pokemon {
//             constructor(display_name = '', actions = [], level = 0, xp = 0) {
//                 super(pokemon.id, pokemon.name.english, level, xp, pokemon.type, 
//                     pokemon.base['HP'], 
//                     pokemon.base['Attack'], 
//                     pokemon.base['Defense'], 
//                     pokemon.base['Sp. Attack'], 
//                     pokemon.base['Sp. Defense'], 
//                     pokemon.base['Speed'],
//                     actions)
//                     this.display_name = display_name
//             }
//         }
//         let name = pokemon.name.english.charAt(0).toUpperCase() + pokemon.name.english.slice(1)
//         Object.defineProperty(C, 'name', {value: name});
//         exports[name] = C
//     }
// }

exports['Pikachu'] = class Pikachu extends Pokemon {
    constructor(display_name = '', actions = [], level = 0, xp = 0) {
        super(25, 'Pikachu', level, xp, 'Electric', 100, 20, 20, 10, 10, 30, actions, display_name)
    }
}

exports['Squirtle'] = class Squirtle extends Pokemon {
    constructor(display_name = '', actions = [], level = 0, xp = 0) {
        super(7, 'Squirtle', level, xp, 'Water', 120, 20, 10, 20, 10, 50, actions, display_name)
    }
}

exports['Bulbasaur'] = class Bulbasaur extends Pokemon {
    constructor(display_name = '', actions = [], level = 0, xp = 0) {
        super(1, 'Bulbasaur', level, xp, 'Normal', 150, 10, 10, 10, 10, 0, actions, display_name)
    }
}

exports['Ditto'] = class Ditto extends Pokemon {
    constructor(display_name = '', actions = [], level = 0, xp = 0) {
        super(132, 'Ditto', level, xp, 'Normal', 50, 10, 10, 10, 10, 50, actions, display_name)
    }
}

exports['Charmander'] = class Charmander extends Pokemon {
    constructor(display_name = '', actions = [], level = 0, xp = 0) {
        super(4, 'Charmander', level, xp, 'Normal', 80, 20, 20, 10, 10, 20, actions, display_name)
    }
}