// before loader:
// rstest.mock('add', async () => {
//   const originalModule = await import('lodash/capitalize.js')
//   const __output = originalModule.default
//   return __output
// })
//
let resolveMock = undefined
const mockPromise = new Promise((_resolve) => {
  resolveMock = _resolve
})

__webpack_require__.rstest_register_module(
  require.resolve('add'),
  async () => {
    const originalModule = await import('lodash-es/capitalize.js')
    const __output = originalModule.default
    return __output
  },
  resolveMock
)

await mockPromise

// -------------------------------------------

let resolveMock2 = undefined
const mockPromise2 = new Promise((_resolve) => {
  resolveMock2 = _resolve
})

__webpack_require__.rstest_register_module(
  require.resolve('ok'),
  async () => {
    const originalModule = require('radashi')
    const __output = originalModule.title
    return __output
  },
  resolveMock2
)

await mockPromise2

// CJS
const cap = require('add')
const capWithSuffix = require('./use-lodash-cjs.js')
const title = require('ok')
const titleWithSuffix = require('./use-external-cjs.js')

console.log('🟢', cap('ok'))
console.log('🟢', capWithSuffix('ok'))
console.log('🟢', title('hello world.'))
console.log('🟢', titleWithSuffix('hello world.'))

export {}
