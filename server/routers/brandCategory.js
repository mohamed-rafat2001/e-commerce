const express = require('express')
const brandCat = require('../models/brandCategory')
const auth = require('../middelwares/auth')
const Product = require('../models/products')
const route = express.Router()
// add catagory
route.post('/brandCat', auth.user, auth.admin, async (req, res) => {
    try {
        const cat = new brandCat(req.body)
        await cat.save()
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
// update category
route.patch('/brandCat/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const cat = await brandCat.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
// get single category
route.get('/brandCat/:cat', async (req, res) => {
    try {
        const Brand = req.params.cat
        const cat = await Product.find({ Brand })
        if (!cat) return res.send('no category founded')
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
// find single category and delete
route.delete('/brandCat/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const cat = await brandCat.findByIdAndDelete(_id)
        if (!cat) return res.send('no category founded')
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
// get all category
route.get('/admin/allBrandCat', auth.user, auth.admin, async (req, res) => {
    try {
        const cat = await brandCat.find()
        if (!cat) return res.send('no category founded')
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
route.get('/allBrandCat', async (req, res) => {
    try {
        const cat = await brandCat.find()
        if (!cat) return res.send('no category founded')
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
module.exports = route