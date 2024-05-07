import { fetchRaw, fetchForm } from "../utils/fetch.js";

const userId = 6;
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
            } else {
                throw new Error(
                    "게시글 정보를 불러오는데 실패했습니다. 다시 시도해주세요."
                );
            }
        })
        .then((data) => {
            if (data.user_id !== userId) {
                alert("본인 게시글만 수정할 수 있습니다.");
                window.location.href = "/";
            }

            $postTitleField.value = data.title;
            $postContentsField.value = data.content;
            $postImagePreviewField.src = SERVER_BASE_URL + "/" + data.image.path;

            postTitleValid = true;
            postContentsValid = true;
            updateButtonStyle();
        })
        .catch((error) => {
            console.error("There has been a problem with your fetch operation:", error);
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

    await fetchForm(`/posts/${postId}`, "PATCH", formData).then((res) => {
        if (res.status === 200) {
            alert("게시글이 수정되었습니다.");
            window.location.href = `/post/${postId}`;
        } else if (res.status === 409) {
            alert("본인 게시글만 수정할 수 있습니다.");
            window.location.href = "/";
        } else if (res.status === 400) {
            throw new Error("게시글 정보가 없습니다.");
        } else {
            throw new Error("게시글 수정에 실패했습니다.");
        }
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
