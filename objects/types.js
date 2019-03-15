class PokemonType {
    constructor(name = '', imm = [], weak = [], str = []) {
        this.immune = imm
        this.weakness = weak
        this.strengths = str
    }
}

exports.PokemonType = PokemonType

/** 
 *  @function
 *  @name DynamicTypeClassGenerator
 *  @description dynamically converts json data to pokemon classes
 * 
 *  @param {array} data
 */
exports.DynamicTypeClassGenerator = function (data = []) {
    for(let i = 0; i < data.length; i++) {
        let pokemon = data[i]
        let C = class extends PokemonType {
            constructor() {
                super(pokemon.name, pokemon.immunes, pokemon.weaknesses, pokemon.strengths)
            }
        }
        Object.defineProperty(C, 'name', {value: pokemon.name});
        exports[pokemon.name] = C
    }
}