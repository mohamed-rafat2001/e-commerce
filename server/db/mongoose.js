const mongoose = require('mongoose')
const dbconnect = () => {
    try {
        const conn = mongoose.connect("mongodb://127.0.0.1:27017/shoopping")
        console.log('db connected')
    }
    catch (e) {
        console.log(e.message)
    }
}
module.exports = dbconnect