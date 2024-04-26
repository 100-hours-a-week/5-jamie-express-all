import express from "express";
import PostController from "../controllers/postController.js";

const router = express.Router();

/* GET posts listing. */
router.get("/", PostController.getPosts);
router.get("/:post_id", PostController.getPostById);
router.post("/new", PostController.createPost);
router.patch("/:post_id", PostController.updatePost);
router.delete("/:post_id", PostController.deletePost);

export default router;
