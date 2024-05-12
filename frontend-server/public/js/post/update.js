import { fetchRaw, fetchForm } from "../utils/fetch.js";

let postId;
const SERVER_BASE_URL = "http://localhost:8000";

// ===== DOM Elements =====
const $postTitleField = document.getElementById("post-title");
const $postContentsField = document.getElementById("post-contents");
const $postImageField = document.getElementById("post-image");
const $postImagePreviewField = document.getElementById("post-image-preview");

const $postHelper = document.getElementById("post-helper");
const $postUpdateBtn = document.getElementById("post-update-btn");

// ===== DOM LOAD EVENT =====
document.addEventListener("DOMContentLoaded", async () => {
    postId = window.location.pathname.split("/")[2];

    await fetchRaw(`/posts/${postId}`, "GET")
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                location.href = "/signin";
            } else if (res.status === 404) {
                alert("게시글이 존재하지 않습니다.");
                location.href = "/";
            }
        })
        .then((data) => {
            const post = data.post;

            $postTitleField.value = post.title;
            $postContentsField.value = post.content;
            $postImagePreviewField.src = post.image
                ? SERVER_BASE_URL + "/" + post.image.path
                : "";

            postTitleValid = true;
            postContentsValid = true;
            updateButtonStyle();
        })
        .catch((error) => {
            console.error("게시글을 불러오는 중 에러 발생: ", error);
        });
});

// ===== FUNCTIONS =====
let postTitleValid, postContentsValid;
let isTitleChanged = false;
let isContentsChanged = false;
let isImageChanged = false;

$postTitleField.addEventListener("input", () => {
    const postTitle = $postTitleField.value;
    if (postTitle.length === 0) {
        postTitleValid = false;
    } else {
        postTitleValid = true;
        isTitleChanged = true;
    }
    updateButtonStyle();
});

$postContentsField.addEventListener("input", () => {
    const postContents = $postContentsField.value;
    if (postContents.length === 0) {
        postContentsValid = false;
    } else {
        postContentsValid = true;
        isContentsChanged = true;
    }
    updateButtonStyle();
});

$postImageField.addEventListener("change", (e) => {
    const image = e.target.files[0];
    if (!image) {
        $postImagePreviewField.src = "";
        return;
    } else {
        $postImagePreviewField.src = URL.createObjectURL(image);
        isImageChanged = true;
    }
});

$postUpdateBtn.addEventListener("click", async () => {
    if (!postTitleValid | !postContentsValid) {
        $postHelper.textContent = "*제목과 내용을 모두 입력해주세요.";
        return;
    }

    const formData = new FormData();
    if (isTitleChanged) formData.append("title", $postTitleField.value);
    if (isContentsChanged) formData.append("content", $postContentsField.value);
    if (isImageChanged) formData.append("image", $postImageField.files[0]);

    await fetchForm(`/posts/${postId}`, "PATCH", formData)
        .then((res) => {
            if (res.status === 200) {
                alert("게시글이 수정되었습니다.");
                location.href = `/post/${postId}`;
            } else if (res.status === 401) {
                alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                location.href = "/signin";
            } else if (res.status === 404) {
                alert("게시글이 존재하지 않습니다. 다시 시도해주세요.");
                location.href = "/";
            } else if (res.status === 409) {
                alert("본인 게시글만 수정할 수 있습니다.");
                location.href = `/post/${postId}`;
            }
        })
        .catch((error) => {
            console.error("게시글 수정 중 에러 발생: ", error);
        });
});

function updateButtonStyle() {
    if (postTitleValid && postContentsValid) {
        $postHelper.textContent = "";
        $postUpdateBtn.style.backgroundColor = "#7F6AEE";
        $postUpdateBtn.style.cursor = "pointer";
    } else {
        $postUpdateBtn.style.backgroundColor = "#ACA0EB";
        $postUpdateBtn.style.cursor = "";
    }
}
