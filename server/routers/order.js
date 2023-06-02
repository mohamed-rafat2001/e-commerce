const express = require('express')
const Order = require('../models/order')
const auth = require('../middelwares/auth')
const route = express.Router()
// add catagory
route.post('/order', auth.user, async (req, res) => {
    try {
        const order = new Order(req.body)
        await order.save()
        res.send(order)
    }
    catch (e) {
        res.send(e.message)
    }
})
module.exports = route