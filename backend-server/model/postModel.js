/* json 파일의 데이터에 직접 접근해서 CRUD 하는 파일 */

const fs = require("fs");
const path = require("path");
const getKoreanDateTime = require("../utils/dateFormat.js");

let postsJSON;

// ===== POSTS =====

const getPosts = () => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "posts.json"), "utf-8")
    );
    const usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const postList = postsJSON.map((post) => {
        const { title, likes, comments, hits, created_at, post_id, user_id } = post;
        const nickname = usersJSON.find((user) => user.user_id === user_id).nickname;
        const profile_image = usersJSON.find(
            (user) => user.user_id === post.user_id
        ).profile_image;

        return {
            title,
            likes,
            comments,
            hits,
            created_at,
            post_id,
            nickname,
            profile_image,
        };
    });

    console.log("[POST] GET all posts");
    return postList;
};

const getPostById = (post_id) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "posts.json"), "utf-8")
    );
    const usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    // 게시글 정보, 작성자 닉네임, 작성자 프로필 이미지 결합하여 반환
    const post = postsJSON.find((post) => post.post_id === parseInt(post_id));

    if (!post) {
        return 400;
    }

    const nickname = usersJSON.find((user) => user.user_id === post.user_id).nickname;
    const profile_image = usersJSON.find(
        (user) => user.user_id === post.user_id
    ).profile_image;
    const commentsList = post.comments_list.map((comment) => {
        const user = usersJSON.find((user) => user.user_id === comment.user_id);
        return {
            ...comment,
            nickname: user.nickname,
            profile_image: user.profile_image,
        };
    });

    const postWithAuthor = {
        ...post,
        nickname,
        profile_image,
        comments_list: commentsList,
    };

    post.hits += 1;
    savePosts();

    console.log("[POST] GET post by id: ", post.post_id);
    return postWithAuthor;
};

const createPost = ({ user_id, title, content, image }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "posts.json"), "utf-8")
    );

    if (!title || !content || !user_id) {
        return 400;
    }

    const lastPostId = postsJSON.length > 0 ? postsJSON[postsJSON.length - 1].post_id : 0;

    const newPost = {
        post_id: lastPostId + 1,
        title: title,
        content: content,
        image: image,
        user_id: parseInt(user_id),
        created_at: getKoreanDateTime(),
        updated_at: null,
        deleted_at: null,
        likes: 0,
        comments: 0,
        hits: 0,
        comments_list: [],
    };

    postsJSON.push(newPost);
    savePosts();

    console.log("[POST] CREATE post: ", newPost.post_id);
    return newPost.post_id;
};

const updatePost = ({ user_id, post_id, title, content, image }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "posts.json"), "utf-8")
    );

    const postToUpdate = postsJSON.find((post) => post.post_id === parseInt(post_id));
    if (!postToUpdate) {
        return 400;
    } else if (postToUpdate.user_id !== parseInt(user_id)) {
        return 409;
    }

    if (title) {
        postToUpdate.title = title;
    }
    if (content) {
        postToUpdate.content = content;
    }
    if (image) {
        postToUpdate.image = image;
    }

    postToUpdate.updated_at = getKoreanDateTime();
    savePosts();

    return 200;
};

const deletePost = ({ user_id, post_id }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "posts.json"), "utf-8")
    );

    const postIndex = postsJSON.findIndex((post) => post.post_id === parseInt(post_id));

    if (postIndex === -1) {
        return 400;
    } else if (postsJSON[postIndex].user_id !== parseInt(user_id)) {
        return 409;
    }

    postsJSON.splice(postIndex, 1);
    savePosts();

    return 200;
};

// ===== COMMENTS =====

const createComment = ({ user_id, post_id, comment }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "posts.json"), "utf-8")
    );

    const postToUpdate = postsJSON.find((post) => post.post_id === parseInt(post_id));
    if (!postToUpdate) {
        return 400;
    }

    const lastCommentId =
        postToUpdate.comments_list.length > 0
            ? postToUpdate.comments_list[postToUpdate.comments_list.length - 1].comment_id
            : 0;

    const newComment = {
        comment_id: lastCommentId + 1,
        content: comment.content,
        user_id: parseInt(user_id),
        created_at: getKoreanDateTime(),
        updated_at: null,
    };

    postToUpdate.comments_list.push(newComment);
    postToUpdate.comments += 1;
    savePosts();

    console.log("[POST] CREATE comment: ", newComment.comment_id);
    return 200;
};

const updateComment = ({ user_id, post_id, comment_id, update_form }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "posts.json"), "utf-8")
    );

    const postToUpdate = postsJSON.find((post) => post.post_id === parseInt(post_id));
    const commentToUpdate = postToUpdate.comments_list.find(
        (comment) => comment.comment_id === parseInt(comment_id)
    );

    if (!commentToUpdate) {
        return 400;
    } else if (commentToUpdate.user_id !== parseInt(user_id)) {
        return 409;
    }

    Object.keys(update_form).forEach((key) => {
        commentToUpdate[key] = update_form[key];
    });

    commentToUpdate.updated_at = getKoreanDateTime();
    savePosts();

    console.log("[POST] UPDATE comment: ", commentToUpdate.comment_id);
    return 200;
};

const deleteComment = ({ user_id, post_id, comment_id }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "posts.json"), "utf-8")
    );

    const postToUpdate = postsJSON.find((post) => post.post_id === parseInt(post_id));
    const commentToDelete = postToUpdate.comments_list.find(
        (comment) => comment.comment_id === parseInt(comment_id)
    );

    if (!commentToDelete) {
        return 400;
    } else if (commentToDelete.user_id !== parseInt(user_id)) {
        return 409;
    }

    postToUpdate.comments_list = postToUpdate.comments_list.filter(
        (comment) => comment.comment_id !== parseInt(comment_id)
    );
    postToUpdate.comments -= 1;
    savePosts();

    return 200;
};

// ===== COMMON FUNCTIONS =====

function savePosts() {
    fs.writeFileSync(
        path.join(__dirname, "../data", "posts.json"),
        JSON.stringify(postsJSON)
    );
}

// ===== EXPORT =====

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
