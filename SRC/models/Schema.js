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
const cartSchema = new mongoose.Schema({
    userid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    product : {
        type  : mongoose.Schema.Types.ObjectId,
        ref : "product",
    },
    price: {
        type : numbers,
        ref : "product"
    },
    quantity: { 
        type : Number,
        default : 1,
    }
})
const orderschema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User" 
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "product"
    },
    product_price:{
        type : number,
        ref : "cart"
    },

    Total_price: {
        type : number ,
    },
    quantity : {
        type  : number,
        ref : "cart"
    },
    Address : {
       type :  String,   
        required : true , 
    },
    payment_Status : {
        type : String,
        default : "pending"
    },
    order_Status: {
        type  : String , 
        default : "processing", 
    }

})

const productmodel = mongoose.model("product" , productschema)
const usermodel = mongoose.model("User" , userschema)
const cartmodel = mongoose.model("cart" , cartSchema)
const ordermodel = mongoose.model("order" , orderschema)
module.exports = {usermodel  , productmodel , cartmodel , ordermodel}