// before loader:
const title = require('pkg1')

module.exports = (...args) => title(...args) + ' --- use-external'
