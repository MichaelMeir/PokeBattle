class Player {
    constructor(token, pokemons = [], level = 0, exp = 0, inventory_size = 10, money = 100) {
        this.token = token
        this.pokemons = pokemons
        this.level = level
        this.exp = exp
        this.inventory_size = inventory_size
        this.money = money
        this.fighting = null
        this.enemy = null
    }

    enemyAttack() {
        if(this.enemy == null) {
            console.log("player has no enemy")
            return
        }
        let skill = this.enemy.actions[Math.floor(Math.random() * this.enemy.actions.length)]
        console.log(this.enemy.name + ' used ' + skill.name)
        this.fighting.damage(skill)
    }

    ownAttack(skillIndex) {
        if(!(skillIndex >= 0 && skillIndex < this.fighting.actions.length)) return
        this.enemy.damage(this.fighting.actions[skillIndex])
        this.enemyAttack()
    }
}

let players = {}

exports.NewPlayer = (pokemons, level, exp, inventory_size, money, token_ = "") => {
    let token = token_
    while(true) {
        if(players[token] != undefined || token == "") {
            token = CreateToken(25)
        }else{
            break
        }
    }
    let pl = new Player(token, pokemons, level, exp, inventory_size, money)
    players[token] = pl
    return pl
}

exports.GetPlayer = (token) => {
    return players[token]
}

function CreateToken(length = 15, usable = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") {
    let out = ''
    for(let i = 0; i < length; i++) {
        out += usable.split('')[Math.floor(Math.random() * usable.length)];
    }
    return out
}

