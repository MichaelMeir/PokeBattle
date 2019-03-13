class PokemonType {
    constructor(id = -1, name = '', imm = [], weak = [], str = []) {
        this.id = id
        this.immune = imm
        this.weakness = weak
        this.strengths = str
    }
}