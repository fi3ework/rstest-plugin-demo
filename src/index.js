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
  'ok',
  async () => {
    const originalModule = await import('radashi')
    const __output = originalModule.title
    return __output
  },
  resolveMock2
)

await mockPromise2

// ESM
const cap = await import('add')
const capWithSuffix = await import('./use-lodash.js')
const title = await import('ok')
const titleWithSuffix = await import('./use-external.js')

console.log('🟢', cap.default('ok'))
console.log('🟢', capWithSuffix.default('ok'))
console.log('🟢', title('hello world.'))
console.log('🟢', titleWithSuffix.default('hello world.'))

// CJS

export {}
