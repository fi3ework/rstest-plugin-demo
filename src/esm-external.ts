// === source ===
// import { cap } from 'lodash-es/capitalize.js'
// const sayHi = () => cap('hi')
// console.log(sayHi())
// === source ===

// === after loader ===
const cap = (await import('lodash-es/capitalize.js')).default
const sayHi = () => cap('hi')
console.log(sayHi())

export {}
