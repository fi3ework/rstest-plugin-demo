// before loader:
// import cap from 'lodash'
const cap = (await import('add')).default

export default (...args) => cap(...args) + ' --- use-foo'
