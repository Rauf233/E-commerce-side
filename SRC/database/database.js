require('dotenv').config
const mongoose = require("mongoose")

const connectdb = async () => {
    try{
        const uri = await mongoose.connect(process.env.MONGOURI)
        console.log(`Database is connected ${uri}`)
    }
    catch(error)
    {
        console.error(`There is error in connection ${error.message}`)
        process.exit(1)
    }
}
module.exports = connectdb
//M1kKAsR0GubRSdG7