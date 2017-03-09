const {Connection, Request} = require('tedious')
var config = {
  userName: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  // If you are on Microsoft Azure, you need this:
  options: {encrypt: true, database: process.env.SQL_DBNAME, rowCollectionOnRequestCompletion: true}
}

var connection = new Connection(config)

connection.on('connect', (err) => {
  if (err) {
    console.log(err.stack)
  }
// If no error, then good to proceed.
  console.log('DB Connected')
})

function getAll(options, callback) {
    const sql = `select SalesOrderId, CustomerId from SalesLT.SalesOrderHeader`
    const query = new Request(sql, (err, rowCount, rows) => {
      console.log('fetching select all')
      const orders = rows.map((columns) => {
        return {
          order_number: columns[0].value,
          customer_id: columns[1].value,
        }
      })
      callback(orders)
    })
    connection.execSql(query)
}

function getOneById(id, callback) {
    const sql = `select SalesOrderId, CustomerId from SalesLT.SalesOrderHeader where SalesOrderId = ${id}`
    const query = new Request(sql, (err, rowCount, rows) => {
      const orders = rows.map((columns) => {
        return {
          order_number: columns[0].value,
          customer_id: columns[1].value,
        }
      })
      callback(orders[0] ? orders[0] : null)
    })
    connection.execSql(query)
}

module.exports = {
    getAll,
    getOneById
}
