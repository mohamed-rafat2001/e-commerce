const express = require('express')
const Cart = require('../models/cart')
const Product = require('../models/products')
const auth = require('../middelwares/auth')
const route = express.Router()
// add catagory
route.post('/cart', auth.user, async (req, res) => {
    try {
        const alreadyCartExist = await Cart.find({ orderedBy: req.user._id }).deleteOne()
        if (alreadyCartExist) alreadyCartExist
        const cart = new Cart({ ...req.body, orderedBy: req.user._id, })
        let totalCar = []
        let totalPro = []
        for (let i = 0; i < req.body.products.length; i++) {
            const pro = Product.findById(req.body.products[i].product)
            const pri = await pro.select('price')
            const count = req.body.products[i].count
            cart.products[i].price = pri.price
            totalCar.push(pri.price)
            totalPro.push(Number(count))

        }
        cart.totalPriceCart = totalCar.reduce((a, b) => a + b, 0);
        cart.totalProduct = totalPro.reduce((a, b) => a + b, 0);
        cart.totalAfterDiscount = cart.totalPriceCart - 50
        await cart.save()
        res.send(cart)
    }
    catch (e) {
        res.send(e.message)
    }
})
// get single cart
route.get('/cart', auth.user, async (req, res) => {
    try {
        const cart = await Cart.findOne({ orderedBy: req.user._id })
        if (!cart) return res.send('no cart founded')
        await cart.populate('products.product')
        res.send(cart)
    }
    catch (e) {
        res.send(e.message)
    }
})
route.patch('/cart', auth.user, async (req, res) => {
    try {
        const product = req.params.id
        const cart = await Cart.findOneAndUpdate({ orderedBy: req.user._id }, req.body, { new: true })
        if (!cart) return res.send('no cart founded')
        res.send(cart)
    } catch (e) {
        res.send(e.message)
    }
})
route.delete('/cart', auth.user, async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ orderedBy: req.user._id })
        if (!cart) return res.send('no cart founded')
        res.send({ cart, message: 'deleted successfully' })
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = route