import express from "express";
import UserController from "../controllers/userController.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

/* users listing. */
router.post("/signup", upload.single("profile_image"), UserController.signUp);
router.post("/signin", UserController.signIn);
router.delete("/", UserController.withdrawal);
router.get("/", UserController.getUserById);

router.patch("/info", UserController.updateUserInfo);
router.patch("/password", UserController.updateUserPassword);

export default router;
