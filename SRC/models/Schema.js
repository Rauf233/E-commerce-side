const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type  : String, 
        required : true , 
    }
})
const productschema = new mongoose.Schema({
    name  : { 
        type : String , 
        required  : true , 
    },
    type : {
        type : String , 
        required : true,
    },
    category : {
        type : String , 
        required : true
    },
    price : { 
        type : number,
        required : true,
        min : 0
    },
    Image : { 
        type : String
    },
    Stock : {
        type : numbers , 
        required : true , 
        default : 0,
    }
})
const cart = new mongoose.Schema({
    userid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User,
    },
    product : {
        type  : mongoose.Schema.Types.ObjectId,
        ref : product,
    }
})
const productmodel = mongoose.model("product" , productschema)
const usermodel = mongoose.model("User" , userschema)
module.exports = {usermodel  , productmodel}