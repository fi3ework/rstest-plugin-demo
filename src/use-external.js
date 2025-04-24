// before loader:
// import cap from 'lodash'
const title = await import('pkg1')

export default (...args) => title(...args) + ' --- use-external'
