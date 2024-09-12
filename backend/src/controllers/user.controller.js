import React from 'react'
import User from "../models/user.model.js"
import {Apierror} from "../utils/Apierror.js"
import { asynchandler } from "../utils/Asynchander.js";
import { uploadonCloundinary } from "../utils/cloudinary.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import jwt, { decode } from "jsonwebtoken"
import mongoose, { mongo } from "mongoose";


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
    return res.status(200).json(new Apiresponce(200,createUser,"user registration done"));
  
})


export {RegisterUser}