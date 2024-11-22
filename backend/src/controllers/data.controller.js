import User from "../models/user.model.js";
import Data from "../models/data.model.js";
import { asynchandler } from "../utils/Asynchander.js";
import { Apierror } from "../utils/Apierror.js";

import { Apiresponce } from "../utils/Apiresponce.js";
import { isValidObjectId } from "mongoose";
import { uploadonCloundinary } from "../utils/cloudinary.js";

const CreateData = asynchandler(async (req, res) => {

    //  console.log(req.body);

    const { title } = req.body;
    if (!title) {
        throw new Apierror(500, "title requried")
    }
    const data = req.files?.dataFile;
    if (!data) {
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

const GetRecentData = asynchandler(async (req, res) => {
    try {
        const data = await Data.aggregate([
            {
                $match: {
                    owner: req.user._id
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 2
            }
        ]);
        //   console.log(data);

        return res.status(200).json(new Apiresponce(200, data, "latest data fetched")); // Send the response with the aggregated data
    } catch (error) {
        throw new Apierror(500, "Failed to fetch recent data");
    }
});


const Deletefile = asynchandler(async (req, res) => {
    try {
        const { fileId } = req.params
        if (!isValidObjectId(fileId)) {
            throw new Apierror(400, "Invalid file id");
        }

        const data = await Data.findById(fileId);
        if (!data) {
            throw new Apierror(404, "No data found with this id");
        }
        const deleteFile = await Data.findByIdAndDelete(fileId);
        if (!deleteFile) {
            throw new Apierror(404, "No data found with this id");
        }
        return res.status(200).json(new Apiresponce(200, {}, "File deleted successfully"));

    } catch (error) {
        return res.status(500).json(new Apiresponce(500, {}, "Error deleting file"))
    }
})

const GetUserData = asynchandler(async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Apierror(404, "User not found")
        }

        const data = await Data.find({ owner: user._id }).select("-owner")
        if (!data) {
            throw new Apierror(404, "No data found")
        }

        //console.log(data); for debugging purposes
        return res.status(200).json(
            new Apiresponce(200, data, "Data fetched successfully")
        )
    } catch (error) {
        return res.status(500)
            .json(new Apiresponce(500, {}, "error occured in GetUserData"));
    }

})

const SearchData = asynchandler(async (req,res)=>{
    try {
        const {searchQuery} = req.query;
        if(!searchQuery){
            throw new Apierror(400,"Search query is required");
        }
        const data = await Data.find({title: {$regex: searchQuery, $options: 'i'}}).select("-owner");
        if(!data){
            throw new Apierror(404,"No data found matching the search query");
        }
        return res.status(200).json(
            new Apiresponce(200,data,"Data fetched successfully")
        )


    } catch (error) {
        return res.status(500)
           .json(new Apiresponce(500,{},"error occured in SearchData"));
    }

})

export { CreateData, GetUserData, GetRecentData, Deletefile ,SearchData}