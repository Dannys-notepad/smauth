const uuid = () => {
  const numbers = '1234567890abcdefghijklmnopqrstuvwxyz'
  let result = ''
  for(let idx = 0; idx < 50; idx++){
    result += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }
  return result
}

const appId = () => {
  const numbers = '1234567890abcdefghijklmnopqrstuvwxyz'
  let result = 'smauth_'
  for(let idx = 0; idx < 25; idx++){
    result += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }
  return result
}


//console.log(uniqueId())
//console.log(appId())

module.exports = {
  uuid,
  appId
}