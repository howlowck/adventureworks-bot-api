var repository = require('../lib/orderRepository')

module.exports = {
  get: (req, res) => {
    const {status, email} = req.query
    repository.getAll({status, email}, (data) => {
      res.json(data)
    })
  }
}
