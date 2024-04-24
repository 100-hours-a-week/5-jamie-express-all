const postId = 1;

// ===== DOM Elements =====
const $postTitleField = document.getElementById("post-title");
const $postContentsField = document.getElementById("post-contents");
const $postImageField = document.getElementById("post-image");
const $postImagePreviewField = document.getElementById("post-image-preview");

const $postHelper = document.getElementById("post-helper");
const $postSubmitBtn = document.getElementById("post-submit-btn");
const $postUpdateBtn = document.getElementById("post-update-btn");

// ===== DOM LOAD EVENT =====
document.addEventListener("DOMContentLoaded", async () => {
    await fetch("../../../../json/get_post_1.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            $postTitleField.value = data.post_title;
            $postContentsField.value = data.post_content.replace(
                /(?:\\r\\n|\\r|\\n)/g,
                "\n"
            );
            $postImagePreviewField.src = data.file_path;

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
    console.log(e.target.files);
    if (e.target.files.length === 0) {
        $postImagePreviewField.src = "";
        return;
    } else {
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        $postImagePreviewField.src = imageUrl;
    }
});

$postSubmitBtn
    ? $postSubmitBtn.addEventListener("click", () => {
          if (!postTitleValid | !postContentsValid) {
              $postHelper.textContent = "*제목과 내용을 모두 입력해주세요.";
              return;
          }

          // TODO: [POST] post write API request
          // post contents는 longtext 타입으로 저장

          alert("게시글이 작성되었습니다.");
          window.location.href = "/public/html/post/contents.html";
      })
    : null;
$postUpdateBtn
    ? $postUpdateBtn.addEventListener("click", () => {
          if (!postTitleValid | !postContentsValid) {
              $postHelper.textContent = "*제목과 내용을 모두 입력해주세요.";
              return;
          }

          // TODO: [POST] post update API request
          // post contents는 longtext 타입으로 저장

          alert("게시글이 수정되었습니다.");
          window.location.href = "/public/html/post/contents.html";
      })
    : null;

function updateButtonStyle() {
    if (postTitleValid && postContentsValid) {
        $postHelper.textContent = "";
        if ($postUpdateBtn) {
            $postUpdateBtn.style.backgroundColor = "#7F6AEE";
            $postUpdateBtn.style.cursor = "pointer";
        }
        if ($postSubmitBtn) {
            $postSubmitBtn.style.backgroundColor = "#7F6AEE";
            $postSubmitBtn.style.cursor = "pointer";
        }
    } else {
        if ($postUpdateBtn) {
            $postUpdateBtn.style.backgroundColor = "#ACA0EB";
            $postUpdateBtn.style.cursor = "";
        }
        if ($postSubmitBtn) {
            $postSubmitBtn.style.backgroundColor = "#ACA0EB";
            $postSubmitBtn.style.cursor = "";
        }
    }
}
