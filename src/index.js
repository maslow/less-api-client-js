const Cloud = require('./cloud')

function init(config) {
    return new Cloud(config)
}
module.exports = {
    init,
    Cloud
}