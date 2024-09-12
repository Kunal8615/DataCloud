import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import Verifyjwt from "../middlewares/auth.middleware.js"
import { RegisterUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/resigter").post(
    upload.fields([
        {
            name : "profilePicture",
            maxCount : 1
        }
    ]),RegisterUser
)

export default router;

