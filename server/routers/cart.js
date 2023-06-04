const express = require('express')
const Cart = require('../models/cart')
const User = require('../models/user')
const Product = require('../models/products')
const auth = require('../middelwares/auth')
const route = express.Router()
// add catagory
route.post('/cart', auth.user, async (req, res) => {
    try {
        const alreadyCartExist = await Cart.find({ orderedBy: req.user._id }).deleteOne()
        if (alreadyCartExist) alreadyCartExist
        const cart = new Cart({ ...req.body, orderedBy: req.user._id, })
        totalCar = []
        totalPro = []
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

        const user = await User.findById(req.user._id) //find user
        user.cart = cart._id  // add idCart to user.cart
        await user.save()
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
        const user = await req.user.populate('cart')
        res.send(await user.cart.populate('products.product'))
    }
    catch (e) {
        res.send(e.message)
    }
})
// update in cart
route.patch('/cart', auth.user, async (req, res) => {
    try {
        const cart = await Cart.findOne({ orderedBy: req.user._id })
        const prod = await Cart.findByIdAndUpdate({ _id: cart._id }, req.body, { new: true })
        if (!prod) return res.send('no cart founded')
        res.send(prod)
    } catch (e) {
        res.send(e.message)
    }
})
// delete cart
route.delete('/cart', auth.user, async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ orderedBy: req.user._id })
        if (!cart) return res.send('no cart founded')
        res.send({ cart, message: 'deleted successfully' })
    } catch (e) {
        res.send(e.message)
    }
})
//delete product from cart
route.delete('/cart/product/:id', auth.user, async (req, res) => {
    try {
        const product = req.params.id // product id
        const cart = await Cart.findOne({ orderedBy: req.user._id }) // cart
        const proDoc = cart.products.find((el) => el.product.toString() === product) // product document
        if (!proDoc) return res.send('no product founded')
        cart.totalPriceCart = cart.totalPriceCart - Number(proDoc.price)
        cart.totalProduct = cart.totalProduct - Number(proDoc.count)
        cart.totalAfterDiscount = cart.totalPriceCart - 50
        await proDoc.remove()
        await cart.save()
        res.send(cart)
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = route