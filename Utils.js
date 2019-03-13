exports.Required = function(route, required = []) {
    for(let i = 0; i < required.length; i++) {
        if(route.values[required[i]] == undefined) {
            return false
        }
    }
    return true
}