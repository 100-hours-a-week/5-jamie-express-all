fetch("../../../json/get_posts.json")
    .then((response) => {
        // 응답을 JSON 형태로 파싱
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        // 데이터 처리
        const postList = data;

        const $postListContainer = document.getElementById("postlist-container");
        postList.forEach((post) => {
            const $post = document.createElement("div");
            $post.innerHTML = `
                <div class="post-overview list-view">
                    <div class="post-info">
                        <span class="title" id="post-title-${post.post_id}"
            }">${post.post_title}</span>
                        <div class="post-info-detail">
                            <span class="stats">좋아요 ${post.like} 댓글 ${changeCount(
                post.comment_count
            )} 조회수 ${changeCount(post.hits)}</span>
                                <span class="date">${post.created_at
                                    .replace("T", " ")
                                    .substring(0, 16)}</span>
                    </div>
                </div>
                <hr class="hr-with-margin" />
                <div class="post-writer">
                    <img
                        class="userimage"
                        src="${post.profile_image_path}"
                        alt="user"
                    />
                    <span class="writer">${post.nickname}</span>
                </div>
            </div>
            `;
            $postListContainer.appendChild($post);
        });
    })
    .catch((error) => {
        // 에러 처리
        console.error("There has been a problem with your fetch operation:", error);
    });
