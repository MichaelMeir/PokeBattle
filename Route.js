
module.exports = class Route {
    constructor (path, response, method = 'get', prefix = '') {
        this.path = path
        this.resp = response
        this.method = method.toLocaleLowerCase()
        this.prefix = prefix.toLocaleLowerCase()

        this.regexPath = '^' + this.path.replace('/', '\/').replace('*', '.*') + '$'
    }

    response(req, res) {
        this.request = req
        this.values = this.method == 'post' ? req.body : req.query
        this.resp(req, res, this)
    }

    match(req) {
        if(req.headers.host == undefined) {
            return false
        }
        let prefix = req.headers.host.split('.')
        prefix.pop()
        prefix.pop()
        return req.url.split('?')[0].match(this.regexPath) && this.method == req.method.toLocaleLowerCase() && this.prefix == prefix.join('.')
    }
}