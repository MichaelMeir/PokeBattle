class PokemonItem {
    constructor(id = -1, name = '', action = (() => {})) {
        this.id = id
        this.name = name
        this.action = action
    }
}