import { fetchRaw } from "../utils/fetch.js";

let postId;
let commentList = [];
const SERVER_BASE_URL = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", async () => {
    postId = location.pathname.split("/")[2];

    // 게시글 정보 가져오기
    await fetchRaw(`/posts/${postId}`, "GET")
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                location.href = "/signin";
            } else if (res.status === 404) {
                alert("게시글 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
                location.href = "/";
            }
        })
        .then((data) => {
            const post = data.post;
            const currentUserId = data.current_user_id;

            // === DOM Elements ===
            const $postTitle = document.getElementById("post-title");
            const $postWriterProfileImage = document.getElementById("profile-image");
            const $postWriterNickname = document.getElementById("post-writer-nickname");
            const $postUploadedDate = document.getElementById("post-uploaded-date");

            const $postImageField = document.querySelector(".post-image");
            const $postImage = document.querySelector(".post-image img");
            const $postContent = document.getElementById("post-text");
            const $postHitsCount = document.getElementById("hits-count");
            const $postCommentCount = document.getElementById("comment-count");

            // === 게시글 정보 ===
            const postWriterUserId = post.user_id;

            $postTitle.innerText = post.title;
            $postWriterProfileImage.src = SERVER_BASE_URL + "/" + post.profile_image.path;
            $postWriterNickname.innerText = post.nickname;
            $postUploadedDate.innerText = post.created_at;
            $postContent.innerHTML = post.content.replace(/\n/g, "<br>");
            $postHitsCount.innerText = changeCount(post.hits);
            $postCommentCount.innerText = post.comments;

            // 이미지 없는 게시글이라면 이미지 컴포넌트 숨기기
            if (post.image) {
                $postImage.src = SERVER_BASE_URL + "/" + post.image.path;
            } else {
                $postImageField.style.display = "none";
            }

            if (currentUserId === postWriterUserId) {
                // 작성자와 로그인한 사용자가 같을 경우
                const $postMenu = document.querySelector(".post-menu");
                const $postMenuItems = document.createElement("div");
                $postMenuItems.innerHTML = `
                            <button
                                class="menu-btn"
                                onclick="location.href='/post/${postId}/update'"
                            >
                                수정
                            </button>
                            <button class="menu-btn post-delete-btn btn-delete">삭제
                            </button>
                            `;

                $postMenu.appendChild($postMenuItems);
            }

            // === 댓글 정보 ===
            commentList = post.comments_list;
            const $commentListContainer = document.querySelector(
                ".comment-list-container"
            );

            commentList.forEach((comment) => {
                const commentWriterUserId = comment.user_id;

                const $commentContainer = document.createElement("div");
                $commentContainer.classList.add("comment");
                $commentContainer.setAttribute("comment-id", comment.comment_id);
                $commentContainer.innerHTML = `
                            <div class="comment-info">
                                <div class="writer-info">
                                    <img class="userimage" src="${SERVER_BASE_URL}/${comment.profile_image.path}" alt="user" />
                                    <span class="writer">${comment.nickname}</span>
                                    <span class="date">${comment.created_at}</span>
                                </div>
                                <span class="comment-contents">${comment.content}</span>
                            </div>`;

                if (currentUserId === commentWriterUserId) {
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
    const $commentDeleteButtons = document.querySelectorAll(".comment-delete-btn");
    $postDeleteButton
        ? $postDeleteButton.addEventListener("click", () => {
              showPostModal();
          })
        : null;
    $commentDeleteButtons
        ? $commentDeleteButtons.forEach((button) => {
              button.addEventListener("click", () => {
                  showCommentModal();
              });
          })
        : null;

    const $commentUpdateButton = document.querySelector(".comment-update-btn");
    $commentUpdateButton
        ? $commentUpdateButton.addEventListener("click", () => {
              const commentId = $commentUpdateButton.getAttribute("comment-id");
              const commentFound = commentList.find(
                  (comment) => comment.comment_id === parseInt(commentId)
              );

              // 수정할 댓글 내용과 id를 추가
              $commentField.value = commentFound.content;
              $commentField.setAttribute("comment-id", commentId);

              $commentUploadButton.innerText = "댓글 수정";
              $commentUploadButton.style.backgroundColor = "#7F6AEE";
              $commentUploadButton.style.cursor = "pointer";
          })
        : null;
});

// ===== DOM Elements =====
const $commentField = document.getElementById("comment");
const $commentUploadButton = document.getElementById("comment-upload-btn");

const $postModal = document.querySelector(".post-modal");
const $commentModal = document.querySelector(".comment-modal");
const $modalBackdrop = document.querySelector(".modal-backdrop");

const $postModalCloseButton = document.getElementById("post-modal-close-btn");
const $commentModalCloseButton = document.getElementById("comment-modal-close-btn");
const $postModalConfirmButton = document.getElementById("post-modal-confirm-btn");
const $commentModalConfirmButton = document.getElementById("comment-modal-confirm-btn");

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

$commentUploadButton.addEventListener("click", async () => {
    const comment = $commentField.value;

    if ($commentUploadButton.innerText === "댓글 등록") {
        if (comment.length !== 0) {
            await fetchRaw(`/posts/${postId}/comment`, "POST", {
                content: comment,
            }).then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else if (res.status === 400) {
                    alert("게시글이 존재하지 않습니다. 다시 시도해주세요.");
                    location.href = "/";
                } else if (res.status === 401) {
                    alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                    location.href = "/signin";
                }
            });

            alert("댓글이 등록되었습니다.");
            location.reload();
        }
    } else if ($commentUploadButton.innerText === "댓글 수정") {
        const commentId = $commentField.getAttribute("comment-id");

        await fetchRaw(`/posts/${postId}/comment/${commentId}`, "PATCH", {
            content: comment,
        }).then((res) => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 400) {
                alert("게시글이 존재하지 않습니다. 다시 시도해주세요.");
                location.href = "/";
            } else if (res.status === 401) {
                alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                location.href = "/signin";
            } else if (res.status === 404) {
                alert("댓글이 존재하지 않습니다. 다시 시도해주세요.");
                location.reload();
            } else if (res.status === 409) {
                alert("본인 댓글만 수정할 수 있습니다.");
                location.reload();
            }
        });
        alert("댓글이 수정되었습니다.");
        location.reload();
    }
});

$postModalCloseButton.addEventListener("click", () => {
    $postModal.style.display = "none";
    $modalBackdrop.style.display = "none";
});
$commentModalCloseButton.addEventListener("click", () => {
    $commentModal.style.display = "none";
    $modalBackdrop.style.display = "none";
});

$postModalConfirmButton.addEventListener("click", () => {
    confirmDelete("post");
});
$commentModalConfirmButton.addEventListener("click", () => {
    confirmDelete("comment");
});

function showPostModal() {
    $postModal.style.display = "flex";
    $modalBackdrop.style.display = "block";
}
function showCommentModal() {
    $commentModal.style.display = "flex";
    $modalBackdrop.style.display = "block";
}

async function confirmDelete(object) {
    if (object === "post") {
        await fetchRaw(`/posts/${postId}`, "DELETE")
            .then((res) => {
                if (res.status === 200) {
                    alert("게시글이 삭제되었습니다.");
                    location.href = "/";
                    return res.json();
                } else if (res.status === 401) {
                    alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                    location.href = "/signin";
                } else if (res.status === 404) {
                    alert("게시글이 존재하지 않습니다. 다시 시도해주세요.");
                    location.href = "/";
                } else if (res.status === 409) {
                    alert("본인 게시글만 삭제할 수 있습니다.");
                }
            })
            .catch((error) => {
                console.error("게시글 삭제 에러 발생: ", error);
            });
    }

    if (object === "comment") {
        const $commentDeleteButton = document.querySelector(".comment-delete-btn");
        const commentId = $commentDeleteButton.getAttribute("comment-id");

        await fetchRaw(`/posts/${postId}/comment/${commentId}`, "DELETE").then((res) => {
            if (res.status === 200) {
                alert("댓글이 삭제되었습니다.");
                location.reload();
            } else if (res.status === 404) {
                alert("댓글이 존재하지 않습니다. 다시 시도해주세요.");
                location.reload();
            } else if (res.status === 401) {
                alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                location.href = "/signin";
            } else if (res.status === 409) {
                alert("본인 댓글만 삭제할 수 있습니다.");
            }
        });

        $commentModal.style.display = "none";
        $modalBackdrop.style.display = "none";
    }
}

function changeCount(num) {
    if (num >= 1000 && num < 10000) {
        return "1k";
    } else if (num >= 10000 && num < 100000) {
        return "10k";
    } else if (num >= 100000) {
        return "100k";
    } else {
        return num;
    }
}
