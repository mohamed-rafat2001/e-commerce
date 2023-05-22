const mongoose = require('mongoose')
const dbconnect = () => {
    try {
        const conn = mongoose.connect(process.env.URL_DB)
        console.log('db connected')
    }
    catch (e) {
        console.log(e.message)
    }
}
module.exports = dbconnect