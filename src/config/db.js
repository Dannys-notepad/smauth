const mysql = require('mysql2/promise')
const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbDatabase = process.env.DB_DATABASE

const dbConfig = {
  dbHost,
  dbUser,
  dbPassword,
  dbDatabase
}

const db = mysql.createPool(dbConfig)

module.exports = db