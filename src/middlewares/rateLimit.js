const db = require('../data/data.json')

const limitRate = (req, res, next) => {
  let ip = req.ip
  let check = db.filter((d) => d.ip === ip)
  if(check.length > 0){
    return res.status(400).json({message: 'You have to wait for 30 seconds before making another request '})
  }
  next()
}

module.exports = limitRate