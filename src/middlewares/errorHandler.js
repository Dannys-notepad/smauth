const errorHandler = (err, req, res, next) => {
  console.error(err)
  
  let code = err.status || 500
  let message = err.message || 'Internal server error'
  res.status(code).json({
    code,
    message
  })
}

module.exports = errorHandler