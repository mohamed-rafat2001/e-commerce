const express = require('express')
const Blog = require('../models/blog')
const auth = require('../middelwares/auth')
const multer = require('multer')
const route = express.Router()
//create new blog
const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|jfif|png)$/)) {
            return cb(new Error('please upload the pic'), null)
        }
        cb(null, true)
    }
})
route.post('/blog', auth.user, auth.admin, upload.single("pic"), async (req, res) => {
    try {
        const blog = new Blog(req.body)
        blog.image = req.file.buffer
        await blog.save()
        res.send(blog)
    } catch (e) {
        res.send(e.message)
    }
})
// update blog
route.patch('/blog/:id', auth.user, auth.admin, upload.single('pic'), async (req, res) => {
    try {
        const _id = req.params.id
        const blog = await Blog.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!blog) { return res.send('no blog founded') }
        res.send(blog)
    } catch (e) {
        res.send(e.message)
    }
})
//delete blog
route.delete('/blog/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const blog = await Blog.findByIdAndDelete(_id)
        if (!blog) { return res.send('no blog founded') }
        res.send(blog)
    } catch (e) {
        res.send(e.message)
    }
})
//get all blogs
route.get('/blogs', auth.user, async (req, res) => {
    try {
        const blog = await Blog.find({})
        if (!blog) { return res.send('no blogs founded') }
        res.send(blog)
    } catch (e) {
        res.send(e.message)
    }
})
route.delete('/blogs', auth.user, auth.admin, async (req, res) => {
    try {
        const blog = await Blog.find({}).deleteMany()
        if (!blog) { return res.send('no blogs founded') }
        res.send(blog)
    } catch (e) {
        res.send(e.message)
    }
})
//get blog and inc numViews
route.get('/blog/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id
        const blog = await Blog.findByIdAndUpdate(_id, { $inc: { numViews: 1 } }, { new: true })
            .populate('likes').populate('unLikes')
        if (!blog) { return res.send('no blogs founded') }
        res.send(blog)
    } catch (e) {
        res.send(e.message)
    }
})
route.get('/admin/blog/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id
        const blog = await Blog.findByIdAndUpdate(_id, { new: true })
            .populate('likes').populate('unLikes')
        if (!blog) { return res.send('no blogs founded') }
        res.send(blog)
    } catch (e) {
        res.send(e.message)
    }
})
//blog like
route.patch('/like/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id //blog id
        const likesnum = await Blog.findById(_id)
        const numLike = likesnum.likes
        const len = numLike.length
        const numUnLike = likesnum.unLikes
        const lenUnLike = numUnLike.length
        const liked = numLike.includes(req.user._id.toString())
        if (liked == false) {
            const post = await Blog.findByIdAndUpdate(_id, {
                $push: { likes: req.user._id },
                likesNumber: len + 1,
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike > 0 ? lenUnLike - 1 : lenUnLike
            }, { new: true })
            return res.send(post)
        }
        else if (liked == true) {

            const post = await Blog.findByIdAndUpdate(_id, {
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike,
                $pull: { likes: req.user._id },
                likesNumber: len - 1
            }, { new: true })
            return res.send(post)
        }
        else {
            const post = await Blog.findByIdAndUpdate(_id, {
                $pull: { likes: req.user._id },
                likesNumber: len,
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike,
            }, { new: true })
            res.send(post)
        }

    } catch (e) {
        res.send(e.message)
    }
})
//blog unlike
route.patch('/unLike/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id //blog id
        const likesnum = await Blog.findById(_id)
        const numLike = likesnum.likes
        const len = numLike.length
        const numUnLike = likesnum.unLikes
        const lenUnLike = numUnLike.length
        const unLiked = numUnLike.includes(req.user._id.toString())
        if (unLiked == false) {
            const post = await Blog.findByIdAndUpdate(_id, {
                $pull: { likes: req.user._id },
                likesNumber: len > 0 ? len - 1 : len,
                $push: { unLikes: req.user._id },
                unLikesNumber: lenUnLike + 1,

            }, { new: true })
            return res.send(post)
        }
        else if (unLiked == true) {

            const post = await Blog.findByIdAndUpdate(_id, {
                $pull: { likes: req.user._id },
                likesNumber: len,
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike - 1
            }, { new: true })
            return res.send(post)
        }
        else {
            const post = await Blog.findByIdAndUpdate(_id, {
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike,
                $pull: { likes: req.user._id },
                likesNumber: len,
            }, { new: true })
            res.send(post)
        }

    } catch (e) {
        res.send(e.message)
    }
})
module.exports = route
