const mongoose = require('mongoose')
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    descrption: { type: String, required: true },
    category: { type: String, required: true },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    ],
    likesNumber: {
        type: Number,
        default: 0
    },
    unLikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    ],
    unLikesNumber: {
        type: Number,
        default: 0
    },
    image: {
        type: Buffer,
        required: true
    },
    author: { type: String, default: "admin" },
    numViews: { type: Number, default: 0 }

}, { timestamps: true })
blogSchema.methods.toJSON = function () {
    const blog = this.toObject()
    const lenUn = blog.unLikes.length
    const lenL = blog.likes.length
    for (let i = 0; i < lenUn; i++) {
        delete blog.unLikes[i].password
        delete blog.unLikes[i].cart
        delete blog.unLikes[i].role
        delete blog.unLikes[i].createdAt
        delete blog.unLikes[i].updatedAt
        delete blog.unLikes[i].__v
        delete blog.unLikes[i].Block
    }
    for (let i = 0; i < lenL; i++) {
        delete blog.likes[i].password
        delete blog.likes[i].cart
        delete blog.likes[i].role
        delete blog.likes[i].createdAt
        delete blog.likes[i].updatedAt
        delete blog.likes[i].__v
        delete blog.likes[i].Block
    }
    return blog
}
const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog