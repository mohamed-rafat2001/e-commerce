const express = require('express')
const Order = require('../models/order')
const User = require('../models/user')
const Cart = require('../models/cart')
const uniqid = require('uniqid');
const auth = require('../middelwares/auth')
const stripe = require('stripe')(process.env.STRIP_KEY)
const route = express.Router()
// craete order
route.post('/order', auth.user, async (req, res) => {
    try {
        const cart = await Cart.findOne({ orderedBy: req.user._id })
        if (!cart) return res.send('no cart founded')
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
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: {
                price_data: {
                    currency: 'USD',
                    product_data: cart.products,
                    unit_amount: cart.totalPriceCart,
                },

                quantity: cart.totalProduct
            }
        })
        const update = await User.findByIdAndUpdate({ _id: req.user._id },
            { $unset: { cart: cart._id } }, { new: true })
        await cart.remove()
        await order.save()
        res.send(session.url)
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
// delete order by user
route.delete('/order/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id // orderId
        const order = await Order.findOne({ _id, orderedBy: req.user._id }).deleteOne()
        if (!order) return res.send('no orders founded')
        res.send(order)
    } catch (e) {
        res.send(e.message)
    }
})
//delete all orders by user
route.delete('/orders/user', auth.user, async (req, res) => {
    try {
        const orders = await Order.find({ orderedBy: req.user._id }).deleteMany()
        if (!orders) return res.send('no orders founded')
        res.send(orders)
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = route