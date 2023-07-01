const express = require('express')
const BlogCat = require('../models/blogCategory')
const Blog = require('../models/blog')

const auth = require('../middelwares/auth')
const route = express.Router()
// add catagory
route.post('/blogCat', auth.user, auth.admin, async (req, res) => {
    try {
        const cat = new BlogCat(req.body)
        await cat.save()
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
// update category
route.patch('/blogCat/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const cat = await BlogCat.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
// get single category
route.get('/blogCat/:cat', async (req, res) => {
    try {
        const category = req.params.cat
        const cat = await Blog.find({ category })
        if (!cat) return res.send('no category founded')
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
// find single category and delete
route.delete('/blogCat/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const cat = await BlogCat.findByIdAndDelete(_id)
        if (!cat) return res.send('no category founded')
        res.send({ cat, message: "Deleted successfully" })
    }
    catch (e) {
        res.send(e.message)
    }
})
// get all category
route.get('/admin/allBlogCat', auth.user, auth.admin, async (req, res) => {
    try {
        const cat = await BlogCat.find()
        if (!cat) return res.send('no category founded')
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
route.get('/allBlogCat', async (req, res) => {
    try {
        const cat = await BlogCat.find()
        if (!cat) return res.send('no category founded')
        res.send(cat)
    }
    catch (e) {
        res.send(e.message)
    }
})
module.exports = route