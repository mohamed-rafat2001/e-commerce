const express = require('express')
const Order = require('../models/order')
const Cart = require('../models/cart')
const uniqid = require('uniqid');
const auth = require('../middelwares/auth')
const route = express.Router()
// craete order
route.post('/order', auth.user, async (req, res) => {
    try {
        const COD = req.body.COD
        if (COD !== "Cash On Delivery") return res.send('create cash order failed')
        const cart = await Cart.findOne({ orderedBy: req.user._id })
        const order = new Order({
            products: cart.products,
            orderedBy: req.user._id,
            orderStatus: "Cash On Delivery",
            PaymentIntent: {
                id: uniqid(),
                totalPrice: cart.totalPriceCart,
                createdAt: Date.now(),
                status: 'Cash On Delivery',
                currency: 'USD',
                totalProduct: cart.totalProduct
            }
        })
        await order.save()
        res.send(order)
    }
    catch (e) {
        res.send(e.message)
    }
})
// get single order
route.get('/order', auth.user, async (req, res) => {
    try {
        const order = await Order.find({ orderedBy: req.user._id }).populate('products.product')
        if (!order) return res.send('no orders founded')
        res.send(order)
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = route