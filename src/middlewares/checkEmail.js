const DB = require('../data/data.json')

const checkEmail = (req, res, next) => {
  let email = req.query.emailaddress
  let data = DB
  
  if(data.length === 0){
    next()
  }
  
  let testCase = data.filter((d) => d.emailaddress === email)
  
  if(!isThirtySecondsApart(testCase[0].timestamp)){
    return res.status(400).json({message: 'Wait for 30s before making a request '})
  }
  next()
}

function isThirtySecondsApart(timestamp) {
  const now = Math.floor(Date.now() / 1000); // Convert to seconds
  const timeDiff = Math.abs(now - timestamp); // Calculate absolute time difference

  return timeDiff === 30; // Return true if time difference is exactly 30 seconds
}

module.exports = checkEmail