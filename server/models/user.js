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
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
        trim: true
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
        enum: ['user', 'admin']
    },
    Block: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array
    }
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