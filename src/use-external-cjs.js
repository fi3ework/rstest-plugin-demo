// before loader:
const title = require('pkg2')

module.exports = (...args) => title(...args) + ' --- use-external'
