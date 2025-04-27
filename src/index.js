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
await __webpack_require__.rstest_register_module(
  require.resolve('./minus.js'),
  async () => {
    const __output = {
      minus: (a) => a - 0.1,
    }
    return __output
  }
)
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
await __webpack_require__.rstest_register_module('pkg1', async () => {
  const originalModule = await import('radashi')
  const __output = originalModule.title
  return __output
})
// #endregion

// #region after loader:

await __webpack_require__.rstest_register_module(
  require.resolve('@shared/pad'),
  async () => {
    return (str) => `ppp${str}qqq`
  }
)
// #endregion

// ============================================================================================

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

let non_exist_path = (() => {
  let p = undefined
  // let resolved = undefined
  try {
    p = require.resolve('non_exist')
    // resolved = true
  } catch (e) {
    p = 'non_exist'
    // resolved = false
  }
  return p
})()

// #region after loader:
await __webpack_require__.rstest_register_module(non_exist_path, async () => {
  return { foo: 'fooooo' }
})
// #endregion

// #region after loader:

await __webpack_require__.rstest_register_module(
  require.resolve('@shared/pad'),
  async () => {
    return (str) => `ppp${str}qqq`
  }
)
// #endregion

// #region after loader:

// ESM

const { minus } = await import('./minus.js')
const title = await import('pkg1')
const titleWithSuffix = await import('./use-external.js')
const pad = await import('@shared/pad')

let nonExist = undefined
try {
  nonExist = await import('non_exist')
} catch (e) {
  nonExist = __webpack_require__('non_exist')
}

console.log('🟢', minus(2))
console.log('🟢', title('hello world.'))
console.log('🟢', titleWithSuffix.default('hello world.'))
console.log('🟢', pad('[TO_PAD]'))
console.log('🟢', nonExist)

// __dirname __filename
const { filename } = await import('./use-dir')
console.log('🟢', __dirname)
console.log('🟢', filename)

export {}
