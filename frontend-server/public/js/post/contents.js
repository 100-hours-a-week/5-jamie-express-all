const userId = 1;
let postWriterUserId = "";
let commentList = [];

document.addEventListener("DOMContentLoaded", async () => {
    // 게시글 정보 가져오기
    await fetch("../../../json/get_post_1.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            const $postTitle = document.getElementById("post-title");
            const $postWriterProfileImage = document.querySelector(".post-writer img");
            const $postWriterNickname = document.getElementById("post-writer-nickname");
            const $postUploadedDate = document.getElementById("post-uploaded-date");

            const $postImage = document.querySelector(".post-image img");
            const $postContent = document.getElementById("post-text");
            const $postHitsCount = document.getElementById("hits-count");
            const $postCommentCount = document.getElementById("comment-count");

            postWriterUserId = data.user_id;

            $postTitle.innerText = data.post_title;
            $postWriterProfileImage.src = data.profile_image_path;
            $postWriterNickname.innerText = data.nickname;
            $postUploadedDate.innerText = data.created_at
                .replace("T", " ")
                .substring(0, 16);

            $postImage.src = data.file_path;
            $postContent.innerHTML = data.post_content.replace(
                /(?:\\r\\n|\\r|\\n)/g,
                "<br />"
            );
            $postHitsCount.innerText = changeHits(data.hits);
            $postCommentCount.innerText = data.comment_count;

            if (userId === postWriterUserId) {
                // 작성자와 로그인한 사용자가 같을 경우
                const $postMenu = document.querySelector(".post-menu");
                const $postMenuItems = document.createElement("div");
                $postMenuItems.innerHTML = `
                            <button
                                class="menu-btn"
                                onclick="location.href='../post/update.html'"
                            >
                                수정
                            </button>
                            <button class="menu-btn post-delete-btn btn-delete">삭제
                            </button>
                            `;

                $postMenu.appendChild($postMenuItems);
            }
        });

    // 댓글 정보 가져오기
    await fetch("../../../json/get_comments_1.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            commentList = data;
            const $commentListContainer = document.querySelector(
                ".comment-list-container"
            );

            commentList.forEach((comment) => {
                const commentWriterUserID = comment.user_id;

                const $commentContainer = document.createElement("div");
                $commentContainer.classList.add("comment");
                $commentContainer.innerHTML = `
                            <div class="comment-info" comment-id="${comment.comment_id}">
                                <div class="writer-info">
                                    <img class="userimage" src="${
                                        comment.profile_image_path
                                    }" alt="user" />
                                    <span class="writer">${comment.nickname}</span>
                                    <span class="date">${comment.created_at
                                        .replace("T", " ")
                                        .substring(0, 16)}</span>
                                </div>
                                <span class="comment-contents">${
                                    comment.comment_content
                                }</span>
                            </div>`;

                if (userId === commentWriterUserID) {
                    // 작성자와 로그인한 사용자가 같을 경우
                    const $commentMenu = document.createElement("div");
                    $commentMenu.className = "post-menu comment-menu";
                    $commentMenu.innerHTML = `
                        <button class="menu-btn comment-menu-item comment-update-btn" comment-id="${comment.comment_id}">수정</button>
                        <button class="menu-btn comment-menu-item comment-delete-btn btn-delete" comment-id="${comment.comment_id}">삭제</button>
                    `;
                    $commentContainer.appendChild($commentMenu);
                }

                $commentListContainer.appendChild($commentContainer);
            });
        });

    // 수정, 삭제 버튼 이벤트 리스너 등록
    const $postDeleteButton = document.querySelector(".post-delete-btn");
    const $commentDeleteButton = document.querySelector(".comment-delete-btn");
    $postDeleteButton
        ? $postDeleteButton.addEventListener("click", () => {
              showPostModal();
          })
        : null;
    $commentDeleteButton
        ? $commentDeleteButton.addEventListener("click", () => {
              showCommentModal();
          })
        : null;

    const $commentUpdateButton = document.querySelector(".comment-update-btn");
    $commentUpdateButton
        ? $commentUpdateButton.addEventListener("click", () => {
              const commentId = $commentUpdateButton.getAttribute("comment-id");
              const commentFound = commentList.find(
                  (comment) => comment.comment_id === Number(commentId)
              );
              $commentField.value = commentFound.comment_content;
          })
        : null;
});

// ===== DOM Elements =====
const $commentField = document.getElementById("comment");
const $commentUploadButton = document.getElementById("comment-upload-btn");

const $postModal = document.querySelector(".post-modal");
const $commentModal = document.querySelector(".comment-modal");
const $modalBackdrop = document.querySelector(".modal-backdrop");
const $modalConfirmButton = document.querySelector("btn-delete");

// ===== Event Listeners =====

$commentField.addEventListener("input", () => {
    const comment = $commentField.value;

    if (comment.length === 0) {
        $commentUploadButton.style.backgroundColor = "#ACA0EB";
        $commentUploadButton.style.cursor = "";
    } else {
        $commentUploadButton.style.backgroundColor = "#7F6AEE";
        $commentUploadButton.style.cursor = "pointer";
    }
});

$commentUploadButton.addEventListener("click", () => {
    const comment = $commentField.value;

    if (comment.length !== 0) {
        alert("댓글이 등록되었습니다.");
        // TODO: comment upload API request
        $commentField.value = "";
        $commentUploadButton.style.backgroundColor = "#ACA0EB";
        $commentUploadButton.style.cursor = "";
    }
});

function showPostModal() {
    $postModal.style.display = "flex";
    $modalBackdrop.style.display = "block";
}
function showCommentModal() {
    $commentModal.style.display = "flex";
    $modalBackdrop.style.display = "block";
}

function closeModal() {
    if ($postModal) {
        $postModal.style.display = "none";
    }
    if ($commentModal) {
        $commentModal.style.display = "none";
    }
    $modalBackdrop.style.display = "none";
}

function confirmDelete(object) {
    // TODO: post | comment delete API request
    if (object === "post") {
        alert("게시글이 삭제되었습니다.");
        location.href = "/public/views/index.html";
    } else if (object === "comment") {
        alert("댓글이 삭제되었습니다.");
        $commentModal.style.display = "none";
        $modalBackdrop.style.display = "none";
    }
}

function changeHits(hits) {
    if (hits >= 1000 && hits < 10000) {
        return "1k";
    } else if (hits >= 10000 && hits < 100000) {
        return "10k";
    } else if (hits >= 100000) {
        return "100k";
    } else {
        return hits;
    }
}
