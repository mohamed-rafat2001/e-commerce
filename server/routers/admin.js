const express = require('express')
const User = require('../models/user')
const Order = require('../models/order')
const auth = require('../middelwares/auth')
const route = express.Router()
// get all admins
route.get('/admins', auth.user, auth.admin, async (req, res) => {
    try {
        res.send(req.admins)
    } catch (e) {
        res.send(e.message)
    }
})
//get all users
route.get('/users', auth.user, auth.admin, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
        res.send(users)
    }
    catch (e) {
        res.send(e.message)
    }
})
//get single user
route.get('/user/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id)
        res.send(user)
    }
    catch (e) {
        res.send(e.message)
    }
})
//search about user
route.get('/user', auth.user, auth.admin, async (req, res) => {
    try {
        const search = req.query
        const user = await User.find(search)
        res.send(user)
    }
    catch (e) {
        res.send(e.message)
    }
})
//delete user
route.delete('/user/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findByIdAndDelete(_id)
        res.send(user)
    }
    catch (e) {
        res.send(e.message)
    }
})
//block && unBlock user
route.patch('/blockUser/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const findUser = await User.findById(_id)
        if (findUser.Block === false) {
            const user = await User.findByIdAndUpdate(_id, { Block: true }, { runValidators: true, new: true })
            return res.send({ user, message: 'user is blocked' })
        }
        else {
            const user = await User.findByIdAndUpdate(_id, { Block: false }, { runValidators: true, new: true })
            res.send({ user, message: 'user is unBlocked' })
        }

    } catch (e) {
        res.send(e.message)
    }
})
//get all orders
route.get('/orders', auth.user, auth.admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('products.product')
        if (!orders) return res.send('no orders founded')
        const ordersNumber = orders.length
        res.send({ orders, ordersNumber })
    } catch (e) {
        res.send(e.message)
    }
})
//search in order by admin
route.get('/admin/order', auth.user, auth.admin, async (req, res) => {
    try {
        search = req.query
        const orders = await Order.find(search)
        if (!orders) return res.send('no orders founded')
        const ordersNumber = orders.length
        res.send({ orders, ordersNumber })
    } catch (e) {
        res.send(e.message)
    }
})
// update status order
route.patch('/order/status/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id // orderId
        const order = await Order.findById(_id)
        const status = await Order.findByIdAndUpdate(_id, {
            orderStatus: req.body.status,
            PaymentIntent: {
                id: order.PaymentIntent.id,
                totalPrice: order.PaymentIntent.totalPrice,
                createdAt: order.PaymentIntent.createdAt,
                status: req.body.status,
                currency: order.PaymentIntent.currency,
                totalProduct: order.PaymentIntent.totalProduct

            }
        }, { new: true })
        if (!status) return res.send(' not updated')
        res.send(status)
    } catch (e) {
        res.send(e.message)
    }
})
// delete all orders
route.delete('/orders', auth.user, auth.admin, async (req, res) => {
    try {
        const orders = await Order.find({}).deleteMany()
        if (!orders) return res.send('no orders founded')
        res.send(orders)
    } catch (e) {
        res.send(e.message)
    }
})
module.exports = route