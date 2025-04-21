// import cap from 'dummy/cap.js'

// const cap = (await import('dummy/cap.js')).default
const cap = (await import('lodash')).default

export default (...args) => cap(...args) + '__good'
