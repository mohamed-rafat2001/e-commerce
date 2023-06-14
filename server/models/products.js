const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        minlength: '5'
    },
    descrption: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        minlength: '20'
    },
    quantity: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    images: [{
        type: Buffer,
        required: true
    }],
    color: {
        type: String,
        required: true
    },
    ratings: [
        {
            star: { type: Number, default: 0 },
            Comment: { type: String, },
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ],
    totalRatings: { type: Number, default: 0 },
    views: {
        type: Number,
        default: 0
    },
    Brand: {
        type: String,
        required: true
    }
}, { timestamps: true });

productSchema.methods.toJSON = function () {
    const product = this.toObject()
    const len = product.ratings.length
    for (let i = 0; i < len; i++) {
        delete product.ratings[i].postedBy.password
        delete product.ratings[i].postedBy.cart
        delete product.ratings[i].postedBy.role
        delete product.ratings[i].postedBy.createdAt
        delete product.ratings[i].postedBy.updatedAt
        delete product.ratings[i].postedBy.__v
        delete product.ratings[i].postedBy.Block
        delete product.ratings[i].postedBy.wishList

    }
    delete product.adminId.password
    return product
}

//Export the model
const Product = mongoose.model('Product', productSchema)
module.exports = Product