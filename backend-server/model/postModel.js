/* json 파일의 데이터에 직접 접근해서 CRDU 하는 파일 */

import fs from "fs";
import path from "path";
const __dirname = path.resolve();
let postsJSON;

const getPosts = () => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8")
    );
    return postsJSON;
};

const getPostById = (post_id) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8")
    );
    const usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8")
    );

    // 게시글 정보, 작성자 닉네임, 작성자 프로필 이미지 결합하여 반환
    const post = postsJSON.find((post) => post.post_id === parseInt(post_id));
    const nickname = usersJSON.find((user) => user.user_id === post.user_id).nickname;
    const profile_image = usersJSON.find(
        (user) => user.user_id === post.user_id
    ).profile_image;

    return { ...post, nickname, profile_image };
};

const createPost = ({ post, user_id }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8")
    );

    if (!post.title || !post.content || !user_id) {
        return "error: 필수 속성 누락";
    }

    const post_id = postsJSON.length + 1;
    const datetime = new Date().toISOString();

    const newPost = {
        post_id: post_id,
        title: post.title,
        content: post.content,
        image: post.image_path,
        user_id: user_id,
        created_at: datetime,
        updated_at: null,
        deleted_at: null,
        likes: 0,
        comments: 0,
        hits: 0,
    };

    postsJSON.push(newPost);
    savePosts();

    return newPost;
};

const updatePost = ({ post_id, updateList }) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8")
    );

    const postToUpdate = postsJSON.find((post) => post.post_id === parseInt(post_id));
    if (!postToUpdate) {
        return "error: 존재하지 않는 게시글";
    }

    Object.keys(updateList).forEach((key) => {
        postToUpdate[key] = updateList[key];
    });

    const datetime = new Date().toISOString();
    postToUpdate.updated_at = datetime;

    console.log(postsJSON);
    savePosts();

    return postToUpdate;
};

const deletePost = (post_id) => {
    postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "posts.json"), "utf-8")
    );

    postsJSON = postsJSON.filter((post) => post.post_id !== parseInt(post_id));
    savePosts();

    return "delete success";
};

function savePosts() {
    fs.writeFileSync(
        path.join(__dirname, "data", "posts.json"),
        JSON.stringify(postsJSON)
    );
}

export default { getPosts, getPostById, createPost, updatePost, deletePost };
