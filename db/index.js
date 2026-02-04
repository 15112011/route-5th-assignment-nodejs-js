const sqlHandler = require('mysql2')

const dbInstance = sqlHandler.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'retail_store',
})

const establishConnection = () => {
  dbInstance.connect((error) => {
    if (error) return console.error('Database Connection Failed:', error)
    console.log('Successfully connected to the database system.')
  })
}

module.exports = { establishConnection, dbInstance }
