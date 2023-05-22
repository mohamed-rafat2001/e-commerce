const express = require('express')
const User = require('../models/user')
const auth = require('../middelwares/auth')
const bcryptjs = require('bcryptjs')
const route = express.Router()
const nodemailer = require('nodemailer')
// create new user... signUp
route.post('/signUp', async (req, res) => {
    try {
        const email = req.body.email
        const findUser = await User.findOne({ email })
        if (!findUser) {
            const user = new User(req.body)
            await user.save()
            const token = user.gToken()
            return res.send({ user, token })
        }
        res.send('user already exist')

    } catch (e) {
        res.send(e.message)
    }
})
// check if user exist...login
route.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const findUser = await User.findOne({ email })
        if (!findUser) {
            return res.send('email or password is wrong')
        }
        const comparePassword = await bcryptjs.compare(password, findUser.password)
        if (!comparePassword) {
            return res.send('email or password is wrong')
        }
        const token = findUser.gToken()
        res.send({ findUser, token })
    } catch (e) {
        res.send(e.message)
    }
})
route.get('/profile', auth.user, async (req, res) => {
    try {
        res.send(req.user)
    }
    catch (e) {
        res.send(e)
    }
})
route.patch('/profile', auth.user, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        updates.forEach((el) => req.user[el] = req.body[el])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.send(e.message)
    }
})
route.delete('/profile', auth.user, async (req, res) => {
    try {
        const user = await User.deleteOne(req.user)
        res.send('acount success deleted')
    } catch (e) {
        res.send(e.message)
    }
})
//forgot password
route.post('/forgotPassword', async (req, res) => {
    try {
        const email = req.body.email
        const user = await User.findOne({ email })
        const token = user.passwordToken()
        user.passwordResetToken = token
        if (user) {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.MAIL_ID, // generated ethereal user
                    pass: process.env.MP
                    , // generated ethereal password
                },
            });

            // send mail with defined transport object

            let info = await transporter.sendMail({
                from: '"mohamed 👻" <abc@gmail.com.com>', // sender address
                to: user.email, // list of receivers
                subject: "forgot password", // Subject line
                text: `hey ${user.firstName + user.lastName}`, // plain text body
                html: `follow this url to reset password <a href='http://localhost:4000/resetPassword/${token}'>click here</a>`, // html body
            });
        }
        else {
            res.send('no user founded')
        }
        await user.save()
        res.send(user)


    } catch (e) {
        res.send(e.message)
    }
})
//reset password
route.patch('/resetPassword/:token', async (req, res) => {
    try {
        const passwordResetToken = req.params.token
        const user = await User.findOne({ passwordResetToken })
        if (!user) return res.send('you not user')
        user.password = req.body.password
        user.passwordResetToken = ""
        await user.save()
        res.send(user)
    }
    catch (e) {
        res.send(e.message)
    }

})
module.exports = route