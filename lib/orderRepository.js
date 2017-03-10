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
const baseSql = `
  SELECT O.SalesOrderID AS OrderNumber, 
       O.CustomerID AS CustomerNumber, 
       O.OrderDate, 
       O.DueDate AS EstimatedShipmentDate, 
       O.ShipDate AS ActualShipmentDate, 
       CASE
         WHEN O.Status = 5 THEN 'Invoiced'
         WHEN O.Status = 1 THEN 'Open'
         WHEN O.Status = 2 THEN 'Waiting To Be Shipped'
       END AS OrderStatus,
       O.TotalDue as Total,
       O.TaxAmt as Tax,
       O.SubTotal,
       O.Freight
  FROM SalesLT.SalesOrderHeader as O 
    INNER JOIN SalesLT.Customer as C 
    ON O.CustomerID = C.CustomerID`

const transformDataToOrder = (columns) => {
  return {
    order_number: columns[0].value,
    account_number: columns[1].value,
    order_date: columns[2].value,
    estimated_shipment_date: columns[3].value,
    actual_shipment_date: columns[4].value,
    freight: columns[9].value,
    tax: columns[7].value,
    total: columns[6].value,
    subtotal: columns[8].value,
    status: columns[5].value
  }
}

function getAll ({account, orderdate}, callback) {
  let whereStatementSegments = []
  let whereStatement = ''

  if (account) {
    whereStatementSegments.push(`O.CustomerID = ${account}`)
  }

  if (orderdate) {
    whereStatementSegments.push(`convert(date, O.OrderDate) = convert(date, '${orderdate}')`)
  }

  if (whereStatementSegments.length > 0) {
    whereStatement = 'WHERE ' + whereStatementSegments.join(' AND ')
  }

  const sql = `${baseSql} ${whereStatement}`

  const query = new Request(sql, (err, rowCount, rows) => {
    if (err) console.log(err.message)
    console.log('fetching select all')
    const orders = rows.map(transformDataToOrder)
    callback(orders)
  })
  connection.execSql(query)
}

function getOneById (id, callback) {
  const sql = `${baseSql} WHERE O.SalesOrderID = ${id}`
  const query = new Request(sql, (err, rowCount, rows) => {
    if (err) console.log(err.message)
    const orders = rows.map(transformDataToOrder)
    callback(orders[0] ? orders[0] : null)
  })
  connection.execSql(query)
}

module.exports = {
  getAll,
  getOneById
}
