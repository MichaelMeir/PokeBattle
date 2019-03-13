const fs = require('fs')
const Route = require('./Route')
const mime = require('mime-types')
const util = require('util')
const pokedex = require('./objects/pokemon.js')

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
]