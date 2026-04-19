import {uploadoncloudinary} from "../services/cloudinary.js";
const {usermodel , productmodel ,cartmodel , ordermodel}  = require("../models/Schema.js ")
const jwt = require("jsonwebtoken")
const multer = require("multer")

async function registration(req , res){
    const email = req.body.email
    const password = req.body.password
   try{
    const extinguisher = await usermodel.findOne({email : email})    
    if(extinguisher){
        return res.status(400).json({
            message : "user already exist"
        })
    }
    const user = await usermodel.create({
        email: email,
        password : password
    })
    const token = jwt.sign({
        id : user._id ,
        email : email
    }, process.env.JWTSECRET , {expiresIn : '1d'})
    
    res.cookie("token" , token)
    
    res.status(200).json({
        message : "User is Created"
    })
}
    catch(err){
        res.status(400).json({
        message  : "error in registration",
        error : err.message
    })
}}

async function login(req,res){
    const {email , password } = req.body
    
    try{
       const user = await usermodel.findOne({
            email,
            password
        })
        if(!user){
            return res.status(400).json({
                message : "user not found : :"
            })
        }
        
        const token = jwt.sign({
            id : user._id , 
            email : email , 
        } , process.env.JWTSECRET , {expiresIn : '1d'})
        
        res.cookie("token" , token)
        if(email || password){
            return res.status(200).json({
                message : "User logged in Sucessfully",
            })
        }
    }
    
    catch(err){
        return res.status(400).json({
        message : "Invalid Credentials",
        error : err.message,
    })
 }   
}

async function addproduct(req , res){
    const {name , type , category , price , stock} = req.body
    try{
        if(!req.file){
            return res.status(400).json({
                message: "File is not found"
            })
        }

        const localfilepath = req.file.path

        const cloudinaryresponse = await uploadoncloudinary(localfilepath)
        
        if(!cloudinaryresponse){
            return res.status(500).json({
                message : "Cloudinary Upload failed"
            })
        }
        const newproduct = await postmodel.create({
            name , 
            type ,
            category , 
            price , 
            stock , 
            image : cloudinaryresponse.url,
        })
        return res.status(200).json({
            message : "Product is created Sucessfully" ,
            product : newproduct
        })
    } catch(err){
        return res.status(400).json({
            message : "Failed to create a post",
            error : err.message
        })
    }
}

async function getallproducts(req, res){
    try {
        const products = await postmodel.find({});

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        return res.status(200).json({
            message: "Products fetched successfully",
            products: products
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching products",
            error: err.message
        });
    }
}
async function cart(req, res) {
    const { userid, product, quantity } = req.body;
    try {
        if (!userid || !product) {
            return res.status(400).json({ message: "Cart details missing" });
        }
        const newcart = await cartmodel.create({
            product: product,
            userid: userid,
            quantity: quantity || 1,
        });
        return res.status(200).json({
            Message: "Cart added Successfully",
            newcart,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Issue in cart",
            error: error.message,
        });
    }
}

async function order(req, res) {
    const { user, product, quantity, address } = req.body;

    if (!user || !product || !address || !quantity) {
        return res.status(400).json({ message: "Missing required fields for order" });
    }

    try {
        const productData = await productmodel.findById(product);
        if (!productData) {
            return res.status(404).json({ message: "Product not found" });
        }

        const totalprice = productData.price * quantity;

        const newOrder = await ordermodel.create({
            user,
            product,
            quantity,
            totalprice,
            address,
            payment_Status: "Pending",             
            order_Status: "Processing" 
        });

        return res.status(200).json({
            message: "Order created Successfully",
            totalAmount: totalprice,
            order: newOrder
        });

    } catch (error) {
        return res.status(400).json({
            message: "Order cannot be created",
            error: error.message,
        });
    }
}
export { registration, login, addproduct, getallproducts , cart };