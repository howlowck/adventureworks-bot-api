var repository = require('../lib/orderRepository')

module.exports = {
  get: (req, res) => {
    const {account, orderdate} = req.query
    repository.getAll({account, orderdate}, (data) => {
      res.json(data)
    })
  }
}
