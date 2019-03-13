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