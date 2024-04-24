// ===== DOM Elements =====
const $postTitleField = document.getElementById("post-title");
const $postContentsField = document.getElementById("post-contents");
const $postImageField = document.getElementById("post-image");
const $postImagePreviewField = document.getElementById("post-image-preview");

const $postHelper = document.getElementById("post-helper");
const $postSubmitBtn = document.getElementById("post-submit-btn");

// ===== FUNCTIONS =====
let postTitleValid, postContentsValid;

$postTitleField.addEventListener("input", () => {
    const postTitle = $postTitleField.value;
    if (postTitle.length === 0) {
        postTitleValid = false;
    } else {
        postTitleValid = true;
    }
    updateButtonStyle();
});

$postContentsField.addEventListener("input", () => {
    const postContents = $postContentsField.value;
    if (postContents.length === 0) {
        postContentsValid = false;
    } else {
        postContentsValid = true;
    }
    updateButtonStyle();
});

$postImageField.addEventListener("change", (e) => {
    let imageUrl;
    if (e.target.files.length === 0) {
        imageUrl = "";
        return;
    }

    imageUrl = URL.createObjectURL(e.target.files[0]);
    $postImageField.src = imageUrl;
    console.log(imageUrl);

    $postImagePreviewField.src = imageUrl;
});

$postSubmitBtn.addEventListener("click", () => {
    if (!postTitleValid | !postContentsValid) {
        $postHelper.textContent = "*제목과 내용을 모두 입력해주세요.";
        return;
    }

    // TODO: [POST] post write API request
    // post contents는 longtext 타입으로 저장

    alert("게시글이 작성되었습니다.");
    window.location.href = "/public/html/post/contents.html";
});

function updateButtonStyle() {
    if (postTitleValid && postContentsValid) {
        $postHelper.textContent = "";
        $postSubmitBtn.style.backgroundColor = "#7F6AEE";
        $postSubmitBtn.style.cursor = "pointer";
    } else {
        $postSubmitBtn.style.backgroundColor = "#ACA0EB";
        $postSubmitBtn.style.cursor = "";
    }
}
