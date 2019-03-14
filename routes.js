const fs = require('fs')
const Route = require('./Route')
const mime = require('mime-types')
const util = require('util')

const pokedex = require('./objects/pokemon')
const players = require('./objects/Player')

pokedex.DynamicPokemonClassifier(JSON.parse(fs.readFileSync('./data/pokedex.json', 'utf8')))

exports.routes = [
    /**
     *  @callback index
     *  @description sends back index
     *  @returns {file} index.html
     */
    new Route('/', (req, res, route) => {
        res.setHeader('content-type', 'text/html')
        try{
            res.end(fs.readFileSync(`./site/index.html`, 'utf8'))
        }catch(err) {
            res.statusCode = 404;
            res.end();
        }
    }, 'get'),
    /**
     *  @callback index
     *  @description sends back panel
     *  @returns {file} panel.html
     */
    new Route('/panel', (req, res, route) => {
        res.setHeader('content-type', 'text/html')
        try{
            res.end(fs.readFileSync(`./site/panel.html`, 'utf8'))
        }catch(err) {
            res.statusCode = 404;
            res.end();
        }
    }, 'get'),
    /**
     *  @callback resources
     *  @description retrieves static resources requested for
     *  @param {string} resource as wildcard
     * 
     *  @returns {file} response as body/file
     */
    new Route('/static/*', (req, res, route) => {
        let type = mime.lookup(req.url)
        if(type) {
            res.setHeader('content-type', type)
        }
        try{
            let content = fs.readFileSync('./site' + req.url)
            res.end(content)
        }catch(err) {
            res.statusCode = 404;
            res.end();
        }
    }, 'get'),

    /**
     *  @callback create
     *  @description creates new game/user and sends token back
     *  @param {string} resource as wildcard
     * 
     *  @returns {file} response as body/file
     */
    new Route('/create', (req, res, route) => {
        res.setHeader('content-type', 'application/json')
        res.statusCode = 200;
        let player = players.NewPlayer([
            new pokedex.Bulbasaur(),
            new pokedex.Charmander(),
            new pokedex.Squirtle()
        ], 0, 0, 10, 100)
        player.fighting = player.pokemons[Math.floor(Math.random() * player.pokemons.length)]
        res.end(JSON.stringify(player.token))

    }, 'get'),

    /**
     * @callback fighting
     * @description returns data about fighting pokemon
     * 
     * @param {string} token
     * 
     * @returns {object} data of pokemon
     */
    new Route('/fighting', (req, res, route) => {
        if(route.values.token == undefined) {
            res.statusCode = 404
            res.end()
        }else{
            res.end(JSON.stringify({
                pokemon: players.GetPlayer(route.values.token).fighting,
                pixel: players.GetPlayer(route.values.token).fighting.getPixelImage(),
                image: players.GetPlayer(route.values.token).fighting.getImage()
            }))
        }
    }, 'post'),

    /**
     * @callback pokemons
     * @description returns data about all pokemons
     * 
     * @param {string} token
     * 
     * @returns {object} data of pokemons
     */
    new Route('/pokemons', (req, res, route) => {
        if(route.values.token == undefined) {
            res.statusCode = 404
            res.end()
        }else{
            let player = players.GetPlayer(route.values.token)
            let pokemons = []
            for(let i = 0; i < player.pokemons.length; i++) {
                pokemons.push({
                    pokemon: player.pokemons[i],
                    pixel: player.pokemons[i].getPixelImage(),
                    image: player.pokemons[i].getImage()
                })
            }
            
            res.end(JSON.stringify(pokemons))
        }
    }, 'post'),
]