import express from "express";
import PostController from "../controllers/postController.js";

const router = express.Router();

/* GET posts listing. */
router.get("/", PostController.getPosts);
router.get("/:post_id", PostController.getPostById);
router.post("/new", PostController.createPost);
router.patch("/:post_id", PostController.updatePost);
router.delete("/:post_id", PostController.deletePost);
router.post("/:post_id/comment", PostController.createComment);
router.patch("/:post_id/comment/:comment_id", PostController.updateComment);
router.delete("/:post_id/comment/:comment_id", PostController.deleteComment);

export default router;
