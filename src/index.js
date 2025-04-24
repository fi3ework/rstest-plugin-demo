// ==========================================================================================

// #region before loader:
// rstest.mock(
//   './minus.js',
//   async () => {
//     const __output = {
//       minus: (a) => a - 0.1,
//     }
//     return __output
//   },
//   resolveMock
// )
// #endregion

// #region after loader:
let resolveMock = undefined
const mockPromise = new Promise((_resolve) => {
  resolveMock = _resolve
})

__webpack_require__.rstest_register_module(
  require.resolve('./minus.js'),
  async () => {
    const __output = {
      minus: (a) => a - 0.1,
    }
    return __output
  },
  resolveMock
)
await mockPromise
// #endregion

// ==========================================================================================

// #region before loader:
// rstest.mock(
//   'pkg1',
//   async () => {
//     const originalModule = await import('radashi')
//     const __output = originalModule.title
//     return __output
//   },
//   resolveMock
// )
// #endregion

// #region after loader:
let resolveMock2 = undefined
const mockPromise2 = new Promise((_resolve) => {
  resolveMock2 = _resolve
})

__webpack_require__.rstest_register_module(
  'pkg1',
  async () => {
    const originalModule = await import('radashi')
    const __output = originalModule.title
    return __output
  },
  resolveMock2
)

await mockPromise2
// #endregion

// #region after loader:
let resolveMock3 = undefined
const mockPromise3 = new Promise((_resolve) => {
  resolveMock3 = _resolve
})

__webpack_require__.rstest_register_module(
  require.resolve('@shared/pad'),
  async () => {
    return (str) => `ppp${str}qqq`
  },
  resolveMock3
)

await mockPromise3
// #endregion

// ESM

const { minus } = await import('./minus.js')
const title = await import('pkg1')
const titleWithSuffix = await import('./use-external.js')
const pad = await import('@shared/pad')

console.log('🟢', minus(2))
console.log('🟢', title('hello world.'))
console.log('🟢', titleWithSuffix.default('hello world.'))
console.log('🟢', pad('[TO_PAD]'))

// __dirname __filename
const { filename } = await import('./use-dir')
console.log('🟢', __dirname)
console.log('🟢', filename)

export {}
