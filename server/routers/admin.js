const express = require('express')
const User = require('../models/user')
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
//find single user
module.exports = route