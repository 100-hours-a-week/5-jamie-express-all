import express from "express";
import userController from "../controllers/userController.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

/* users listing. */
router.post("/signup", upload.single("profile_image"), userController.signUp);
router.post("/signin", userController.signIn);
router.get("/", userController.getUserById);

export default router;
