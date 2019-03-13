class Player {
    constructor(token, pokemons = [], level = 0, exp = 0, inventory_size = 10, money = 100) {
        this.token = token
        this.pokemons = pokemons
        this.level = level
        this.exp = exp
        this.inventory_size = inventory_size
        this.money = money
        this.fighting = null
    }
}

let players = {}

exports.NewPlayer = (pokemons, level, exp, inventory_size, money, token = "") => {
    let unique = false
    while(!unique) {
        unique = true
        if(players[token]) {
            unique = false
        }else{
            break
        }
        token = CreateToken(25)
    }
    let pl = new Player(token, pokemons, level, exp, inventory_size, money)
    players.push(pl)
    return pl
}

exports.GetPlayer = (token) => {
    return players[token]
}

function CreateToken(length = 15, usable = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+@#!%$*()?1234567890") {
    let out = ''
    for(let i = 0; i < length; i++) {
        out += usable.split('')[Math.floor(Math.random() * usable.length)];
    }
    return out
}

