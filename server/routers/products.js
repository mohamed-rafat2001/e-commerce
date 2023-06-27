const express = require('express')
const Product = require('../models/products')
const User = require('../models/user')
const auth = require('../middelwares/auth')
const route = express.Router()
const multer = require('multer')
//add product
const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|jfif|png)$/)) {
            return cb(new Error('please upload the pic'), null)
        }
        cb(null, true)
    }
})
route.post('/product', auth.user, upload.array('pic', 6), auth.admin, async (req, res) => {
    try {
        const product = new Product({ ...req.body, adminId: req.user._id })
        for (let i = 0; i < req.files.length; i++) { product.images[i] = req.files[i].buffer }

        const lenImages = product.images.length
        await product.save()
        res.send({ product, lenImages })
    } catch (e) {
        res.send(e.message)
    }
})
// get single product
route.get('/product/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id
        const product = await Product.findByIdAndUpdate(_id, {
            $inc: { views: 1 }
        }, { new: true })
        res.send(product)
    } catch (e) {
        res.send(e.message)
    }
})
//update product
route.patch('/product/:id', auth.user, upload.array('pic', 6), auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const product = await Product.findByIdAndUpdate({ _id }, req.body, { new: true, runValidators: true })
        for (let i = 0; i < req.files.length; i++) { product.images[i] = req.files[i].buffer }

        res.send(product)
    } catch (e) {
        res.send(e.message)
    }
})
//delete product
route.delete('/product/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const product = await Product.findByIdAndDelete(_id)
        res.send(product)
    } catch (e) {
        res.send(e.message)
    }
})
//allProduct
route.get('/allProduct', async (req, res) => {
    try {
        const product = await Product.find({})
        res.send(product)
    } catch (e) {
        res.send(e.message)
    }
})
//search about product
route.get('/products', async (req, res) => {
    try {
        //filtiring
        let product = Product.find(req.query)
        if (product == 0) { return res.send('no product found') }

        //sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ")
            console.log(sortBy)
            product = product.sort(sortBy)

        } else { product = product.sort("-createdAt") }
        //limit fileds
        if (req.query.fileds) {
            const fileds = req.query.fileds.split(",").join(" ")
            product = product.select(fileds)
        }
        else {
            product = product.select("-__v")
        }
        //pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        product = product.skip(skip).limit(limit)
        if (req.query.page) {
            const productCount = await product.countDocuments()
            if (skip >= productCount) return res.send('this page does not exist')
        }
        const prod = await (product)
        res.send(prod)
    } catch (e) {
        res.send(e.message)
    }
})
// user rating
route.patch('/rating/:id', auth.user, async (req, res) => {
    try {
        const idUser = req.user._id
        const _id = req.params.id //product id
        const user = await Product.findById(_id)
        const rate = user.ratings.find((userId) => userId.postedBy.toString() === idUser.toString())
        if (rate) {
            const product = await Product.findByIdAndUpdate(_id, {
                $pull: { ratings: { postedBy: req.user._id } },
                $inc: { totalRatings: -1 }
            }, { new: true }).populate('ratings.postedBy')


            return res.send(product)
        }
        const product = await Product.findByIdAndUpdate(_id, {
            $push: { ratings: { star: req.body.star, Comment: req.body.Comment, postedBy: req.user._id, } },
            $inc: { totalRatings: 1 }

        }, { new: true }).populate('ratings.postedBy')
        res.send(product)

    } catch (e) {
        res.send(e.message)
    }
})
// wishList
route.patch('/toWishList/:id', auth.user, async (req, res) => {
    try {
        const _id = req.user._id
        const idPro = req.params.id
        const findUser = await User.findOne({ _id, wishList: idPro })
        if (findUser) {
            const user = await User.findByIdAndUpdate(_id, {
                $pull: { wishList: idPro }
            }, { new: true, runValidators: true })
            return res.send(user)
        }
        const user = await User.findByIdAndUpdate(_id, {
            $push: { wishList: idPro }
        }, { new: true, runValidators: true })

        res.send(user)
    }
    catch (e) {
        res.send(e.message)
    }
})
module.exports = route