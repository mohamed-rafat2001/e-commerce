const mongoose = require('mongoose'); // Erase if already required
const validator = require('validator')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: '3'
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: '3'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('please enter valid email')
            }
        }
    },
    address: { type: String, required: true },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value, { minlength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 })) {
                throw new Error('please enter valid password')
            }
        }
    },
    passwordResetToken: {
        type: String
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    },
    Block: {
        type: Boolean,
        default: false
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });
userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 8)
    }
})
userSchema.methods.gToken = function () {
    const token = jwt.sign({ id: this._id.toString() }, process.env.KEY)
    return token

}
userSchema.methods.passwordToken = function () {
    const token = jwt.sign({ id: this._id.toString() }, process.env.KEY)
    return token


}
userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete (user.password)
    return user
}
//Export the model
const User = mongoose.model('User', userSchema)
module.exports = User