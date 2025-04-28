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
__webpack_require__.set_mock(require.resolve('./minus.js'), async () => {
  const __output = {
    minus: (a) => a - 0.1,
  }
  return __output
})
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
__webpack_require__.set_mock('pkg1', async () => {
  const originalModule = await import('radashi')
  const __output = originalModule.title
  return __output
})
// #endregion

// ==========================================================================================

// #region after loader:
__webpack_require__.set_mock(require.resolve('@shared/pad'), async () => {
  return (str) => `ppp${str}qqq`
})

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

// #region after loader:
__webpack_require__.set_mock('non_exist', async () => {
  return { foo: 'fooooo' }
})
// #endregion

// ==========================================================================================

// #region after loader:

// await __webpack_require__.rstest_register_module(
//   require.resolve('@shared/pad'),
//   async () => {
//     return (str) => `ppp${str}qqq`
//   }
// )
// #endregion

// #region after loader:

// ==========================================================================================

// ESM

const { minus } = await import('./minus.js')
const pad = await import('@shared/pad')

__webpack_require__.set_mock(
  require.resolveWeak('lodash-es/repeat.js'),
  async () => {
    const repeat = await import('lodash-es/repeat.js', {
      with: { actual: true },
    })
    return (str) => repeat.default(str, 2) + ' --- my-repeat'
  }
)
const repeat = await import('lodash-es/repeat.js')
console.log('🟢', repeat('abc'))

function unMock(id) {
  delete __webpack_require__.mock_modules[id]
  delete __webpack_require__.c[id]
}

console.log('🟢', minus(2))
unMock(require.resolve('./minus.js'))
console.log('🟢', minus(2))
const { minus: minusOriginal } = await import('./minus.js')
console.log('🟢', minusOriginal(2))

const title = await import('pkg1')
console.log('🟢', title('hello world.'))
const titleWithSuffix = await import('./use-external.js')
console.log('🟢', titleWithSuffix.default('hello world.'))
console.log('🟢', pad('[TO_PAD]'))
// console.log('🟢', nonExist)

// // __dirname __filename
const { filename } = await import('./use-dir')
console.log('🟢', __dirname)
console.log('🟢', filename)

export {}
