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
  require.resolve('lodash'),
  async () => {
    const originalModule = await import('lodash-es/capitalize.js')
    const __output = originalModule.default
    console.log('👨‍👩‍👧‍👦', __output)
    return __output
  },
  resolveMock
)

await mockPromise

const foo = await import('lodash')
console.log('🟢', foo.default('ok'))
// // === after loader ===

export {}
