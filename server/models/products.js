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
    },
    descrption: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
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
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ],
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
    }
    delete product.adminId.password
    return product
}

//Export the model
const Product = mongoose.model('Product', productSchema)
module.exports = Product