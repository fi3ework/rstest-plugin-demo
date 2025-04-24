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

__webpack_require__.rstest_register_module(
  require.resolve('./minus.js'),
  () => {
    const __output = {
      minus: (a) => a - 0.1,
    }
    return __output
  }
)

// ==========================================================================================

// #region before loader:
// rstest.mock(
//   'pkg1',
//   () => {
//     const originalModule = require('radashi')
//     const __output = originalModule.title
//     return __output
//   },
// )
// #endregion

__webpack_require__.rstest_register_module('pkg1', () => {
  const originalModule = require('radashi')
  const __output = originalModule.title
  return __output
})

// #endregion

// CJS
const { minus } = require('./minus.js')
const title = require('pkg1')
const titleWithSuffix = require('./use-external-cjs.js')

console.log('🟢', minus(2))
console.log('🟢', title('hello world.'))
console.log('🟢', titleWithSuffix('hello world.'))

// __dirname __filename
const { filename } = require('./use-dir')
console.log('🟢', __dirname)
console.log('🟢', filename)
