const mongoose = require("mongoose");

// 1. User Schema
const userschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String, 
        required: true, 
    }
}, { timestamps: true });

// 2. Product Schema
const productschema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
    },
    type: {
        type: String, 
        required: true,
    },
    category: {
        type: String, 
        required: true
    },
    price: { 
        type: Number, 
        required: true,
        min: 0
    },
    image: {
        type: String
    },
    stock: { 
        type: Number, 
        required: true, 
        default: 0,
    }
}, { timestamps: true });

// 3. Cart Schema (Array based)
const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product", 
        },
        quantity: { 
            type: Number,
            default: 1,
            min: 1
        }
    }]
}, { timestamps: true });

// 4. Order Schema
const orderschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        product_price: {
            type: Number,
        },
        quantity: { 
            type: Number,
            required: true
        }
    }],
    Total_price: {
        type: Number,
        required: true
    },
    Address: {
       type: String,   
       required: true, 
    },
    payment_Status: {
        type: String,
        enum: ['pending', 'received'],
        default: "pending"
    },
    order_Status: {
        type: String, 
        enum: ['processing', 'delivered', 'cancelled', 'return'], 
        default: "processing", 
    },
    orderdate: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Models Export
const productmodel = mongoose.model("Product", productschema);
const usermodel = mongoose.model("User", userschema);
const cartmodel = mongoose.model("Cart", cartSchema);
const ordermodel = mongoose.model("Order", orderschema);

module.exports = { usermodel, productmodel, cartmodel, ordermodel };