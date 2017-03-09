var repository = require('../../lib/orderRepository');

module.exports = {
    get: function contacts_get(req, res) {
        repository.getOneById(req.params['id'], (data) => {
            res.json(data)
        })
    }    
};