// === source ===
// import { foo } from './foo'
// const sayHi = () => foo
// console.log(sayHi())
// === source ===

// === after loader ===
const foo = (await import('./foo')).foo
const sayHi = () => foo
console.log(sayHi())

export {}
// === after loader ===
