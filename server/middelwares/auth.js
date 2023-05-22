const jwt = require('jsonwebtoken')
const User = require('../models/user')
const user = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const verifyToken = jwt.verify(token, process.env.KEY)
        if (!verifyToken) { return res.send('you not user') }
        const user = await User.findOne({ _id: verifyToken.id })
        req.user = user
        next()
    } catch (e) {
        res.send(e.message)
    }
}
const admin = async (req, res, next) => {
    try {
        const admins = await User.find({ role: 'admin' })
        if (req.user.role !== 'admin') return res.send('you not admin')
        req.admins = admins
        next()
    } catch (e) {
        res.send(e.message)
    }
}
module.exports = { user, admin }
