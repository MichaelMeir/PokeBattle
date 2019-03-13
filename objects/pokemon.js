class Pokemon {
    constructor(id = -1, name = '', type = [], hp = 100, atk = 20, def = 20, sp_atk = 30, sp_def = 30, spd = 50, actions = []) {
        this.id = id
        this.base_name = name
        this.name = name
        this.type = type
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
}
exports.Pokemon = Pokemon

/** 
 *  @function
 *  @name DynamicPokemonClassifier
 *  @description dynamically converts json data to pokemon classes
 * 
 *  @param {array} data
 */
exports.DynamicPokemonClassifier = function (data = []) {
    for(let i = 0; i < data.length; i++) {
        let pokemon = data[i]
        let C = class extends Pokemon {
            constructor(display_name = '', actions = []) {
                super(pokemon.id, pokemon.name.english, pokemon.type, 
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