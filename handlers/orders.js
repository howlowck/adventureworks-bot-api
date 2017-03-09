var repository = require('../lib/orderRepository');

module.exports = {
    get: function contacts_get(req, res) {
        const {status, email} = req.query
        repository.getAll({status, email}, (data) => {
            res.json(data)
        })
    }
};