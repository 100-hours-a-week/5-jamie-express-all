/* 라우트의 요청(GET, POST, ..)에 따라 모델한테 할 일을 전달해주고.
모델의 응답을 라우트한테 전달해주는 파일
 */

import Post from "../model/postModel.js";

// ===== POSTS ====

const getPosts = async (req, res) => {
    try {
        const posts = await Post.getPosts();
        res.status(200).json(posts);
    } catch (error) {
        // TODO: error status 추가
        res.status(404).json({ message: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.getPostById(req.params.post_id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createPost = async (req, res) => {
    try {
        const post = req.body;
        const user_id = req.headers.user_id;

        const newPost = await Post.createPost({ post, user_id });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const update_form = req.body;
        const post_id = req.params.post_id;

        const updatedPost = await Post.updatePost({ post_id, update_form });
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post_id = req.params.post_id;
        const user_id = req.headers.user_id;

        const isSuccess = Post.deletePost({ user_id, post_id });

        if (isSuccess.startsWith("error")) {
            res.status(409).json({ message: isSuccess });
        } else {
            res.status(200).json({ message: isSuccess });
        }
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// ===== COMMENTS ====

const createComment = async (req, res) => {
    try {
        const comment = req.body;
        const user_id = req.headers.user_id;
        const post_id = req.params.post_id;

        const newComment = await Post.createComment({
            post_id,
            comment,
            user_id,
        });
        res.status(200).json(newComment);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updateComment = async (req, res) => {
    try {
        const post_id = req.params.post_id;
        const comment_id = req.params.comment_id;
        const user_id = req.headers.user_id;
        const update_form = req.body;

        const updatedComment = await Post.updateComment({
            user_id,
            post_id,
            comment_id,
            update_form,
        });
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const user_id = req.headers.user_id;
        const post_id = req.params.post_id;
        const comment_id = req.params.comment_id;

        const isSuccess = Post.deleteComment({ user_id, post_id, comment_id });

        if (isSuccess.startsWith("error")) {
            res.status(409).json({ message: isSuccess });
        } else {
            res.status(200).json({ message: isSuccess });
        }
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export default {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    createComment,
    updateComment,
    deleteComment,
};
