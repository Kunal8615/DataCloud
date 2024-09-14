import { Router } from "express";
import { CreateData,GetUserData } from "../controllers/data.controller.js";
import Verifyjwt from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(Verifyjwt);
router.route("/upload").post(upload.fields([
    {
        name : "dataFile",
        maxCount: 1
    }
]),CreateData);

router.route("/getuserData").get(GetUserData);

export default router;