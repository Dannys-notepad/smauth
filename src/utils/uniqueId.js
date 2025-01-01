const uniqueId = () => {
  const numbers = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for(let idx = 0; idx < 20; idx++){
    result += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }
  return result
}


//console.log(uniqueId())
module.exports = uniqueId