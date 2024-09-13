import jwt from 'jsonwebtoken'; // Import the jwt library
import User from "../models/user.model.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from '../utils/Asynchander.js';

const Verifyjwt = asynchandler(async (req, _, next) => {
    let token;
    let decodedToken;

    try {
        // Extract token from cookies or Authorization header
        token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
        console.log("Extracted token:", token); // Check if token is received

        if (!token) {
            throw new Apierror(401, "Access Denied. Please Login");
        }
        if (typeof token !== "string" || !token.trim()) {
            throw new Apierror(401, "Invalid Token");
        }

        // Verify token
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //    console.log("Decoded token:", decodedToken); // Check if token is decoded

        // Find the user based on the decoded token
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
      //  console.log("User found:", user); // Check if user is found

        if (!user) {
            throw new Apierror(401, "User not found");
        }

        // Attach user to the request object
        req.user = user;
        console.log("req.user:", req.user); // Check if user is attached to req

        next();
    } catch (error) {
        console.error("Error in verifyJWT middleware:", error);
        throw new Apierror(401, error.message || "Invalid access token");
    }
});


export default Verifyjwt;
