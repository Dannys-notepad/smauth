require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require("cookie-parser")
const sessions = require('express-session')
const port = process.env.PORT || 5000
const apiRoutes = require('./src/routes/api.route')
const userRoutes = require('./src/routes/user.route')
const errorHandler = require('./src/middlewares/errorHandler')

app.set('view engine', 'ejs')


app.use(sessions({
  secret: 'process.env.SECRET_KEY',
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  reSave: false
}))
app.use(cookieParser())
app.use(errorHandler)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'src/public')));


app.use('/', userRoutes)
app.use('/api/v1', apiRoutes)


app.get('/', (req, res) => {
  res.json({message: 'Authentication Mail'})
})

app.listen(port, () => console.log(`Server up and running on port ${port}`))
