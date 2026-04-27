const { usermodel, productmodel, cartmodel, ordermodel } = require("../models/Schema.js");
const jwt = require("jsonwebtoken");
const { uploadoncloudinary } = require("../services/cloudinary.js");

// 1. Registration
async function registration(req, res) {
    const { email, password } = req.body;
    try {
        const existingUser = await usermodel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        
        const user = await usermodel.create({ email, password });
        const token = jwt.sign({ id: user._id, email }, process.env.JWTSECRET, { expiresIn: '1d' });
        
        res.cookie("token", token);
        return res.status(201).json({ message: "User Created Successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Error", error: err.message });
    }
}

// 2. Login
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await usermodel.findOne({ email, password });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });
        
        const token = jwt.sign({ id: user._id, email }, process.env.JWTSECRET, { expiresIn: '1d' });
        res.cookie("token", token);
        return res.status(200).json({ message: "Logged in" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function addproduct(req, res) {
    const { name, type, category, price, stock } = req.body;
    try {
        if (!req.file) return res.status(400).json({ message: "Image missing" });

        // Cloudinary upload logic
        const cloudinaryResponse = await uploadoncloudinary(req.file.path);
        
        const newProduct = await productmodel.create({
            name, type, category, price, stock,
            image: cloudinaryResponse.url
        });

        return res.status(201).json({ message: "Product added", product: newProduct });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// 4. Get All Products
async function getallproducts(req, res) {
    try {
        const products = await productmodel.find({});
        return res.status(200).json({ products });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// 5. Cart Logic (Optimized for multiple items)
async function cart(req, res) {
    const { product, quantity } = req.body;
    const userId = req.user.id; 
    try {
        let userCart = await cartmodel.findOne({ user: userId });

        if (userCart) {
            const itemIndex = userCart.items.findIndex(p => p.product.toString() === product);
            if (itemIndex > -1) {
                userCart.items[itemIndex].quantity += (quantity || 1);
            } else {
                userCart.items.push({ product, quantity: quantity || 1 });
            }
            await userCart.save();
        } else {
            userCart = await cartmodel.create({
                user: userId,
                items: [{ product, quantity: quantity || 1 }]
            });
        }
        return res.status(200).json({ message: "Cart updated", userCart });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// 6. Create Order (COD)
async function createOrder(req, res) {
    try {
        const userId = req.user.id;
        const { Address } = req.body;

        const cart = await cartmodel.findOne({ user: userId }).populate('items.product');
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart khali hai" });
        }

        let total = 0;
        const orderItems = cart.items.map(item => {
            total += item.product.price * item.quantity;
            return {
                product: item.product._id,
                product_price: item.product.price,
                quantity: item.quantity
            };
        });

        const newOrder = await ordermodel.create({
            user: userId,
            items: orderItems,
            Total_price: total,
            Address: Address,
            payment_Status: "pending",
            order_Status: "processing"
        });

        await cartmodel.findOneAndDelete({ user: userId });
        return res.status(201).json({ message: "Order Placed Successfully", order: newOrder });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// 7. Get User Order History
async function getMyOrders(req, res) {
    try {
        const orders = await ordermodel.find({ user: req.user.id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        return res.status(200).json({ orders });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { 
    registration, 
    login, 
    addproduct, 
    getallproducts, 
    cart, 
    createOrder, 
    getMyOrders 
};