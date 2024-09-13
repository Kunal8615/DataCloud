import User from "../models/user.model.js";
import Data from "../models/data.model.js";
import { asynchandler } from "../utils/Asynchander.js";
import { Apierror } from "../utils/Apierror.js";
import mongoose from "mongoose";
import { Apiresponce } from "../utils/Apiresponce.js";
import { isValidObjectId } from "mongoose";
import { uploadonCloundinary } from "../utils/cloudinary.js";

const CreateData = asynchandler(async (req, res) => {

  //  console.log(req.body);
   
    const { title } = req.body;
    if(!title) {
        throw new Apierror(500, "title requried")
    }
    const data = req.files?.dataFile;
    if(!data) {
        throw new Apierror(500, "file required")
    }

    const datapath = data[0].path;

    const dataUpload = await uploadonCloundinary(datapath)
    if (!dataUpload) {
        throw new Apierror(500, "failed to upload on cloudnairy")
    }
 //   console.log(req.user?._id);
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new Apierror(404, "User not found")
    }

    const setData = await Data.create({
        title,
        dataFile: dataUpload.url,
        owner: req.user?._id

    })
    if (!setData) {
        throw new Apierror(500, "Failed to create data")
    }
    const getdata = await Data.findById(setData._id)
    if (!getdata) {
        throw new Apierror(500, "Failed to get data")
    }


    return res.status(200).json(
        new Apiresponce(200, getdata, "Data created successfully")
    )

});



const GetUserData = asynchandler(async (req, res) => {
    try {

    } catch (error) {
        return res.status(500)
            .json(new Apiresponce(500, {}, "error occured in GetUserData"));
    }


})

export { CreateData, GetUserData }