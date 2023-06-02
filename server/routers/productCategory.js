const express = require('express')
const ProductCat = require('../models/productCategory')
const auth = require('../middelwares/auth')
const route = express.Router()
// add catagory
route.post('/productCat', auth.user, auth.admin, async (req, res) => {
    try {
        const cat = new ProductCat(req.body)
        await cat.save()
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
// update category
route.patch('/productCat/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const cat = await ProductCat.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
// get single category
route.get('/productCat/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const cat = await ProductCat.findById(_id)
        if (!cat) return res.send('no category founded')
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
// find single category and delete
route.delete('/productCat/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const cat = await ProductCat.findByIdAndDelete(_id)
        if (!cat) return res.send('no category founded')
        res.send({ cat, message: "Deleted successfully" })
    }
    catch (e) {
        res.send(e.message)
    }
})
// get all category
route.get('/allProductCat', auth.user, auth.admin, async (req, res) => {
    try {
        const cat = await ProductCat.find()
        if (!cat) return res.send('no category founded')
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
module.exports = route