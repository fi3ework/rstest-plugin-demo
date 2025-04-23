const loader = function (content) {
  return content
}

export const pitch = function (remainingRequest, precedingRequest, data) {
  console.log('🙎', remainingRequest, precedingRequest, data)
  console.log('👩‍🎨', data)
}

export default loader
