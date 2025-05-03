import User from "../models/User.js"
import bcrypt from "bcryptjs"
import {generateToken} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res) => {
    try{
        const {fullName,email,password} = req.body;

        if(!fullName || !email || !password){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters"});
        }
        const user = await User.findOne({email});
        if(user){ return res.status(400).json({message:"Email already exists"});}

        const salt = await bcrypt.genSalt(10);
        const hashedPassword  = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })

        console.log("New user created",newUser);

        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePicture:newUser.profilePicture,
            });
        }else{
            return res.status(400).json({message:"Invalid user data"});
        }
    }catch(err){
        console.log("Error in signup controller",err.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const login = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }
        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePicture:user.profilePicture,
        });

    }catch(err){
        console.log("Error in login controller",err.message);
        res.status(500).json({message:"Internal server error"});
    }

};

export const logout = (req,res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        return res.status(200).json({message:"Logged out successfully"});
    }catch(err){
        console.log("Error in logout controller",err.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const updateProfile = async (req,res) => {
    try{
        const {profilePicture} = req.body;
        const userId = req.user._id;
        if(!profilePicture){
            return res.status(400).json({message:"Please provide a profile picture"});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePicture);
        const updatedUser = await User.findByIdAndUpdate(userId,{
            profilePicture:uploadResponse.secure_url
        },{new:true});
        res.status(200).json(updatedUser);
    }catch(err){
        console.log("Error in updateProfile controller",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const checkAuth = (req,res) => {
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.log("Error in checkAuth controller",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}