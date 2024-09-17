import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import Verifyjwt from "../middlewares/auth.middleware.js"
import { RegisterUser,loginUser,logoutUser,GetCurrentUser} from "../controllers/user.controller.js";

const router = Router();

router.route("/resigter").post(
    upload.fields([
        {
            name : "profilePicture",
            maxCount : 1
        }
    ]),RegisterUser

)

router.route("/login").post(loginUser);
router.route("/GetCurrentUser").get(Verifyjwt,GetCurrentUser);
router.route("/logout").post(Verifyjwt,logoutUser)


export default router;

