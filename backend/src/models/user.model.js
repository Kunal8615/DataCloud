import mongoose from "mongoose";
import bycrpt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({

    username : {
        type :String,
        required : true,
        unique : true,
        lowercase : true,
        trim: true,
        index : true
    },

    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim: true,
        index : true
    },
    fullname : {
        type : String,
        required : true,
        trim: true,
        index:true
    },
    password : {
        type : String,
        required :[true, "Password is required"]
    
     
    },
    profilePicture : {
        type : String,
        required : true,
    },
    refreshToken : {
        type : String
}}, {timestamps: true});

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    try{
        const hashedPassword = await bycrpt.hash(this.password, 10);
        this.password = hashedPassword;
       return next();
    }catch(err){
        return next(err);
    }
})
//method

UserSchema.methods.isPasswordCorrect = async function(password) {

    return await bycrpt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = function() {
    const payload = {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    }

    const token = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{exprireIn : "1d"})
}

const User = mongoose.model("User",UserSchema);
export default User;
