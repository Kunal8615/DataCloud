import mongoose from "mongoose";

const dataSchema = new mongoose.schema({
    dataFile: {
        type:String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

},{timestamps:true});

const Data = mongoose.model('Data', dataSchema);
export default Data;