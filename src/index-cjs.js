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

__webpack_require__.set_mock(require.resolve('./minus.js'), () => {
  const __output = {
    minus: (a) => a - 0.1,
  }
  return __output
})

// ==========================================================================================
function unMock(id) {
  delete __webpack_require__.mock_modules[id]
  delete __webpack_require__.c[id]
}

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

__webpack_require__.set_mock('pkg1', () => {
  const originalModule = require('radashi')
  const __output = originalModule.title
  return __output
})

// #endregion

__webpack_require__.set_mock('pkg2', () => {
  const originalModule = require('radashi')
  const __output = originalModule.title
  return __output
})

__webpack_require__.set_mock(require.resolveWeak('lodash-es/repeat.js'), () => {
  const repeat = require('lodash-es/repeat.js')
  return (str) => repeat.default(str, 2) + ' --- my-repeat'
})

const repeat = require('lodash-es/repeat.js')
console.log('🟢', repeat('abc'))

// CJS
const { minus } = require('./minus.js')
const title = require('pkg1')
const titleWithSuffix = require('./use-external-cjs.js')

console.log('🟢', minus(2))
unMock(require.resolve('./minus.js'))
const minusOriginal = require('./minus.js')
console.log('🟢', minus(2))
console.log('🟢', minusOriginal.minus(2))

console.log('🟢', title('hello world.'))
console.log('🟢', titleWithSuffix('hello world.'))

// // __dirname __filename
const { filename } = require('./use-dir')
// console.log('🟢', __dirname)
// console.log('🟢', filename)
