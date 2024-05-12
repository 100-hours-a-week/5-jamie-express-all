import { fetchRaw } from "./utils/fetch.js";
const SERVER_BASE_URL = "http://localhost:8000";

// DOM 트리 생성 시 게시글 목록 생성
document.addEventListener("DOMContentLoaded", () => {
    fetchRaw("/posts", "GET")
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 401) {
                alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                location.href = "/signin";
            }
        })
        .then((data) => {
            const postList = data;

            const $postListContainer = document.getElementById("postlist-container");
            postList.forEach((post) => {
                const $post = document.createElement("div");
                $post.innerHTML = `
                <div class="post-overview list-view">
                    <div class="post-info">
                        <span class="title" id="post-title" post-id="${post.post_id}">${
                    post.title
                }</span>
                        <div class="post-info-detail">
                            <span class="stats">좋아요 ${post.likes} 댓글 ${changeCount(
                    post.comments
                )} 조회수 ${changeCount(post.hits)}</span>
                            <span class="date">${post.created_at}</span>
                    </div>
                </div>
                <hr class="hr-with-margin" />
                <div class="post-writer">
                    <img
                        class="userimage"
                        src="${SERVER_BASE_URL}/${post.profile_image.path}"
                        alt="user"
                    />
                    <span class="writer">${post.nickname}</span>
                </div>
            </div>
            `;
                $postListContainer.appendChild($post);
            });

            const $postTitles = document.querySelectorAll(".title");
            $postTitles.forEach((title) =>
                title.addEventListener("click", () => {
                    const postId = title.getAttribute("post-id");
                    location.href = "/post/" + postId;
                })
            );
        })
        .catch((error) => {
            console.error("게시글 목록을 불러오는 중 에러 발생: ", error);
        });
});

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
