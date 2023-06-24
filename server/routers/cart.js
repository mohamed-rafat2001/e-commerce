const express = require('express')
const Cart = require('../models/cart')
const User = require('../models/user')
const Product = require('../models/products')
const auth = require('../middelwares/auth')
const route = express.Router()
// add catagory
route.post('/cart', auth.user, async (req, res) => {
    try {
        const alreadyCartExist = await Cart.findOne({ orderedBy: req.user._id })
        const user = await User.findById(req.user._id) //find user
        if (!alreadyCartExist) {
            var cart = new Cart({ ...req.body, orderedBy: req.user._id })
            user.cart = cart._id  // add idCart to user.cart
            await user.save()
        }
        if (alreadyCartExist) {
            const _id = alreadyCartExist._id
            var cart = await Cart.findByIdAndUpdate(_id, {
                $push: { ...req.body },
                $set: { orderedBy: req.user._id, }
            }, { new: true })
        }

        totalCar = []
        totalPro = []
        for (let i = 0; i < cart.products.length; i++) {
            const pro = Product.findById(cart.products[i].product)
            const pri = await pro.select('price')
            const count = cart.products[i].count
            totalCar.push(pri.price * Number(count))
            totalPro.push(Number(count))

        }
        cart.totalProduct = totalPro.reduce((a, b) => a + b, 0)
        cart.totalPriceCart = totalCar.reduce((a, b) => a + b, 0)
        cart.totalAfterDiscount = cart.totalPriceCart - 50
        await cart.save()
        await cart.populate('products.product')
        res.send(cart)
    }
    catch (e) {
        res.send(e.message)
    }
})
// get single cart
route.get('/cart', auth.user, async (req, res) => {
    try {
        const user = await Cart.findOne({ orderedBy: req.user._id })
        if (!user) { return res.send({ message: 'no product' }) }
        res.send(await user.populate('products.product'))
    }
    catch (e) {
        res.send(e.message)
    }
})
// delete cart
route.delete('/cart', auth.user, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user._id })
        const cart = await Cart.findById({ _id: user.cart })
        if (cart) {
            const cartId = await Cart.findOne({ orderedBy: req.user._id }).deleteOne()
            const update = await User.findByIdAndUpdate({ _id: req.user._id }, { $unset: { cart: cart._id } }, { new: true })
            return res.send(cartId)
        }
        res.send('no product founded')
    } catch (e) {
        res.send(e.message)
    }
})
//delete product from cart
route.delete('/cart/product/:id', auth.user, async (req, res) => {
    try {
        const product = req.params.id // product id
        const cart = await Cart.findOne({ orderedBy: req.user._id }) // cart
        const proDoc = cart.products.find((el) => el.product.toString() === product)// product document
        if (!proDoc) return res.send('no product founded')
        const search = await Product.findById({ _id: proDoc.product })
        cart.totalPriceCart = cart.totalPriceCart - search.price * proDoc.count
        cart.totalProduct = cart.totalProduct - proDoc.count
        cart.totalAfterDiscount = cart.totalPriceCart - 50
        await proDoc.remove()
        await cart.save()
        res.send(cart)
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = route