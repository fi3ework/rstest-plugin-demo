// === before loader ===
// import { foo } from './example.js?mocked'
// rstest.mock('./example.js', async () => {
//   const originalModule = await rstest.importActual('./example.js')
//   return { ...originalModule, b: 1 }
// })
// console.log(foo)
// === before loader ===

// === after loader ===
let resolveMock = undefined
const mockPromise = new Promise((_resolve) => {
  resolveMock = _resolve
})

__webpack_require__.rstest_register_module(
  require.resolve('lodash-es/capitalize.js'),
  async () => {
    // const originalModule = await importActual('lodash-es/capitalize.js')
    const originalModule = await import('lodash-es/capitalize.js')
    const __output = originalModule.default
    const mocked = (...args) => {
      return __output(...args) + '...'
    }
    return mocked
  },
  resolveMock
)
await mockPromise

const cap = await import('lodash-es/capitalize.js')

// const foo = await import('./use-lodash.js')
//
console.log('🟢', cap('ok'))
// === after loader ===

export {}
