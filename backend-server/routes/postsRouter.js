import express from "express";
import PostController from "../controllers/postController.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

/* posts listing. */
router.get("/", PostController.getPosts);
router.get("/:post_id", PostController.getPostById);

router.post("/new", upload.single("image"), PostController.createPost);
router.patch("/:post_id", PostController.updatePost);
router.delete("/:post_id", PostController.deletePost);

router.post("/:post_id/comment", PostController.createComment);
router.patch("/:post_id/comment/:comment_id", PostController.updateComment);
router.delete("/:post_id/comment/:comment_id", PostController.deleteComment);

export default router;
