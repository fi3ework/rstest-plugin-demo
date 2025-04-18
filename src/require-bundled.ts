// === source ===
// const { foo } = require('./foo')
// const sayHi = () => foo
// console.log(sayHi())
// === source ===

// === after loader ===
const foo = require('./foo')
const sayHi = () => foo
console.log(sayHi())

export {}
// === after loader ===
