class PokemonAction {
    constructor(id = -1, name = '', acc = 100, pp = 30, power = 50, type = 'normal', action = (() => {})) {
        this.id = id
        this.name = name
        this.acc = acc
        this.pp = pp
        this.power = power
        this.type = type
        this.action = action
    }
}

exports.PokemonAction

exports.actions = {}

/** 
 *  @function
 *  @name DynamicActionClassGenerator
 *  @description dynamically converts json data to action classes
 * 
 *  @param {array} data
 */
exports.DynamicActionClassGenerator = function (data = []) {
    for(let i = 0; i < data.length; i++) {
        let pokemon = data[i]
        let C = class extends PokemonAction {
            constructor() {
                if(pokemon.power == null) {
                    super(pokemon.id, pokemon.ename, pokemon.accuracy, pokemon.pp, pokemon.power, pokemon.type, (enemy, self, action) => {
                        self.hp += action.pp
                    })
                }else{
                    super(pokemon.id, pokemon.ename, pokemon.accuracy, pokemon.pp, pokemon.power, pokemon.type, (enemy, self, action) => {
                        enemy.damage(action)
                    })
                }
            }
        }
        let name = pokemon.ename.charAt(0).toUpperCase() + pokemon.ename.slice(1)
        Object.defineProperty(C, 'name', {value: name});
        exports.actions[name] = C
    }
}