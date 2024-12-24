const JWT = require('jsonwebtoken')
const userModel = require('../models/userModel')
const {hashPassword, comparePassword} = require("../helpers/authHelper");
//const expressJWT = require('express-jwt');
var {expressjwt: jwt} = require("express-jwt");

//Middleware
const requireSingIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});

const registerController = async (req, res) =>{
    try{
        const {name, email, password} = req.body;
        //validation
        if(!name){
            return res.status(400).send({
                success:false,
                message:'Name is required'
            });
        }
        if(!email){
            return res.status(400).send({
                success:false,
                message: 'E-mails is required'
            });
        }
        if(!password || password.length < 6){
            return res.status(400).send({
                success:false,
                message:'Password is required'
            });
        }
        //Existing user:
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(500).send({
                success:false,
                message:'User already register with this email'
            });
        }
        //Hashedpassword
        const hashedPassword = await hashPassword(password)
        
        //Save user:
        const user = await userModel({
            name, 
            email, 
            password:hashedPassword
        }).save();

        res.status(201).send({
            success:true,
            message:'Registration succesfull'
        });
    }catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error in register API',
            error,
        });
    }
};

//login
const loginController = async (req, res) =>{
    try{
        const {email, password} = req.body;
        //Validation
        if(!email || !password ){
            return res.status(500).send({
                success:false,
                message: 'Please provide Email or Password',
            });
        }
        //Find user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(500).send({
                success:false,
                message:"User not found",
            });
        }
        //Math password
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(500).send({
                success:false,
                message:'Invalid username or password',
            });
        };
         //TOKEN JWT
         const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{
            expiresIn:'7d'
        })
        //Undefined password
        user.password = undefined;
        res.status(200).send({
            success:true,
            message:'Login successfully',
            user,
            token,
        });
    }catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error in login API',
            error
        })
    }
};

//Update user
const updateUserController = async (req,res) =>{
    try{
        const {name, password, email} = req.body;
        //User find:
        const user = await userModel.findOne({email});
        //Password Validate
        if(password && password.lenght<6){
            return res.status(400).send({
                success:false,
                message:'Password is required and should be 6 character long'
            });
        }
        
        const hashedPassword = password ? await hashPassword(password) : undefined;
        //Update user
        const updateUser = await userModel.findOneAndUpdate(
            {email},{
                name: name || user.name,
                password: hashedPassword || user.password,
                //email: email || user.email
            },{new:true});
            updateUser.password = undefined;
            res.status(200).send({
                success:true,
                message:"Profile updated, please login",
                updateUser,
            }
        );
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in user update API',
            error
        })
    }
};


module.exports= {
    requireSingIn,
    registerController,
    loginController,
    updateUserController,
}