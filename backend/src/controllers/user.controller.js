
import User from "../models/user.model.js"
import {Apierror} from "../utils/Apierror.js"
import { asynchandler } from "../utils/Asynchander.js";
import { uploadonCloundinary } from "../utils/cloudinary.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import jwt, { decode } from "jsonwebtoken"




const GenerateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Apierror(404, "User not found");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // Save refresh token in database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);  // Error details ko log karo
        throw new Apierror(500, error.message || "something went wrong while generating tokens");
    }
};


const RegisterUser = asynchandler(async (req,res)=>{
    const {fullname,email,username,password} = req.body;
    if ([fullname, email, username, password].some(field => !field || field.trim() === "")) {
        throw new Apierror(400, "All fields are required");
    }

    const existuser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existuser){
        throw new Apierror(400, "User already exists");
    }
    const profilePicturePath = req.files?.profilePicture?.[0].path;
    if(!profilePicturePath){

        throw new Apierror(400, "Profile picture is required");
    }
    const profilePicture = await uploadonCloundinary(profilePicturePath);

    if(!profilePicture){
        throw new Apierror(500, "Failed to upload profile picture");
    }

    //create user
    const user = await User.create({
        fullname,
        email,
        username,
        password,
        profilePicture: profilePicture.url
    })
    const createUser = await User.findById(user.id).select("-password -refreshToken")
    

    if(!createUser){
        throw new Apierror(500, "Failed to create user");
    }
    console.log("user created");
    return res.status(200).json(new Apiresponce(200,createUser,"user registration done"));
  
})

const logoutUser = asynchandler(async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $unset: {
          refreshToken: 1
        }
      }, {
        new: true
      });
      const options = {
        httpOnly: true,
        secure: true
      };
 
  console.log("user logout done");
      return res.status(200)
        .clearCookie("accessToken", options).clearCookie("refreshToken", options)
        .json(new Apiresponce(200, {}, "User logged out"));
    } catch (error) {
      return res.status(500).json(new Apiresponce(500, {}, "An error occurred during logout"));
    }
  });

const loginUser = asynchandler(async (req,res)=>{
    const {email, password} = req.body;
    if (!email) {
        throw new Apierror(400, "All fields are required");
    }
    const user = await User.findOne( {email})

    if(!user){
        throw new Apierror(401, "Invalid credentials");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new Apierror(401, "Invalid user credentials");
    }

    
    const {accessToken, refreshToken} = await GenerateAccessAndRefreshTokens(user._id)
    const loggedUser = await User.findById(user._id).select("-password -refreshToken")
    const option = {
        httpOnly: true,
        sameSite: "None",
        secure : "true",
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000)
    }
 console.log(loggedUser,"Login Done");

 return res.status(200)
 .cookie("accessToken", accessToken, option)
 .cookie("refreshToken", refreshToken,option)
 .json(new Apiresponce(200,{user : loggedUser},"User logged in successfully"));
})

const GetCurrentUser = asynchandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return next(new Apierror(404, "User not found"));
    }

  
    const userData = await User.findById(user._id).select("-password");


    if (!userData) {
        return next(new Apierror(404, "User not found"));
    }

    return res.status(200).json(
        new Apiresponce(200, userData, "User fetched successfully")
    );
});



export {RegisterUser,loginUser,logoutUser,GetCurrentUser}