// before loader:
// import cap from 'lodash'
const title = await import('ok')

export default (...args) => title(...args) + ' --- use-external'
