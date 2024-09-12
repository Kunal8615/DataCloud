import User from "../models/user.model.js"
import {Apierror }from "../utils/Apierror.js"
import {asynchandler} from "../utils/Asynchander.js"

const Verifyjwt = asynchandler(async (req,_,next)=>{
    let token
    let decodedToken;

    try {
        token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer"," ")

        if(!token){
            throw new Apierror(401,"Access Denied. Please Login") 
        }
        if(typeof token !=="string" ||!token.trim()){
            throw new Apierror(401,"Invalid Token")
        }

        decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user =await User.findOne(decodedToken?._id).select("-password -refreshToken")

        req.user = user;
        next()
    } catch (error) {
        console.error("Error in verifyJWT middleware:", error);
        throw new Apierror(401, error?.message || "Invalid access token");
    }
})
export default Verifyjwt;