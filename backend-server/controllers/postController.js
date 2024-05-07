const Post = require("../model/postModel.js");

// ===== POSTS ====

const getPosts = async (req, res) => {
    const posts = await Post.getPosts();
    res.status(200).json(posts);
};

const getPostById = async (req, res) => {
    const { post_id } = req.params;

    const post = await Post.getPostById(post_id);

    if (post === 400) {
        res.status(400).json({ message: "게시글 정보 없음" });
    } else {
        res.status(200).json(post);
    }
};

const createPost = async (req, res) => {
    const { user_id } = req.headers;
    const { title, content } = req.body;
    const image = req.file;

    const isSuccess = await Post.createPost({ user_id, title, content, image });

    if (isSuccess === 400) {
        res.status(400).json({ message: "누락된 정보가 있습니다." });
    } else if (isSuccess === 409) {
        res.status(409).json({ message: "게시글 작성 실패" });
    } else {
        res.status(200).json({ post_id: isSuccess });
    }
};

const updatePost = async (req, res) => {
    const { user_id } = req.headers;
    const { post_id } = req.params;
    const { title, content } = req.body;
    const image = req.file;

    const isSuccess = await Post.updatePost({ user_id, post_id, title, content, image });

    if (isSuccess === 400) {
        res.status(400).json({ message: "게시글 정보 없음" });
    } else if (isSuccess === 409) {
        res.status(409).json({ message: "게시글 수정 권한 없음" });
    } else if (isSuccess === 200) {
        res.status(200).json({ message: "게시글 수정 완료" });
    }
};

const deletePost = async (req, res) => {
    const { post_id } = req.params;
    const { user_id } = req.headers;

    const isSuccess = Post.deletePost({ user_id, post_id });

    if (isSuccess === 400) {
        res.status(400).json({ message: "게시글 정보 없음" });
    } else if (isSuccess === 409) {
        res.status(409).json({ message: "게시글 삭제 권한 없음" });
    } else if (isSuccess === 200) {
        res.status(200).json({ message: "게시글 삭제 완료" });
    }
};

// ===== COMMENTS ====

const createComment = async (req, res) => {
    const comment = req.body;
    const { user_id } = req.headers;
    const { post_id } = req.params;

    const isSuccess = await Post.createComment({
        post_id,
        comment,
        user_id,
    });
    if (isSuccess === 400) {
        res.status(400).json({ message: "게시글 정보 없음 (post_id 오류)" });
    } else if (isSuccess === 200) {
        res.status(200).json({ message: "댓글 작성 완료" });
    }
};

const updateComment = async (req, res) => {
    const { post_id, comment_id } = req.params;
    const { user_id } = req.headers;
    const update_form = req.body;

    const isSuccess = await Post.updateComment({
        user_id,
        post_id,
        comment_id,
        update_form,
    });

    if (isSuccess === 400) {
        res.status(400).json({ message: "댓글 정보 없음" });
    } else if (isSuccess === 409) {
        res.status(409).json({ message: "댓글 수정 권한 없음" });
    } else if (isSuccess === 200) {
        res.status(200).json({ message: "댓글 수정 완료" });
    }
};

const deleteComment = async (req, res) => {
    const { user_id } = req.headers;
    const { post_id, comment_id } = req.params;

    const isSuccess = Post.deleteComment({ user_id, post_id, comment_id });

    if (isSuccess === 400) {
        res.status(400).json({ message: "댓글 정보 없음" });
    } else if (isSuccess === 409) {
        res.status(409).json({ message: "댓글 삭제 권한 없음" });
    } else if (isSuccess === 200) {
        res.status(200).json({ message: "댓글 삭제 완료" });
    }
};

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    createComment,
    updateComment,
    deleteComment,
};
