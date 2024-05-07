import { fetchRaw } from "./fetch.js";
const SERVER_BASE_URL = "http://localhost:8000";

// ===== Header =====
document.addEventListener("DOMContentLoaded", async function () {
    const $headerContainer = document.querySelector(".header-container");

    // TODO: 로그인 토큰 확인
    let isLoggedIn;
    let userInfo;

    await fetchRaw("/users", "GET")
        .then(async (res) => {
            if (res.status === 200) {
                isLoggedIn = true;
                await res.json().then((data) => {
                    userInfo = data;
                });
            } else {
                isLoggedIn = false;
                return null;
            }
        })
        .catch((error) => {
            console.error("유저 정보 불러오기 에러 발생: ", error);
        });

    const headerElement = createHeader(isLoggedIn);
    $headerContainer.appendChild(headerElement);

    const $userProfileImageField = document.getElementById("header-profile-img");
    $userProfileImageField.src = `${SERVER_BASE_URL}/${userInfo.profile_image.path}`;

    // === 모달창 ===
    const $headerModal = document.getElementById("header-modal");
    $headerModal
        ? document.getElementById("header-profile-img").addEventListener("click", () => {
              if ($headerModal.style.display === "block") {
                  $headerModal.style.display = "none";
              } else {
                  $headerModal.style.display = "block";
              }
          })
        : null;
});

function createHeader(isLoggedIn) {
    const header = document.createElement("div");
    header.classList.add("block");

    if (!isLoggedIn) {
        header.innerHTML = `
            <span class="header-title" onclick="location.reload()">
                아무 말 대잔치
            </span>
        `;
    } else {
        header.innerHTML = `
            <button class="back" onclick="window.history.back()">
                <img src="../../images/icons/chevron-left.png" />
            </button>
            <span class="header-title" onclick="location.href='/'">
                아무 말 대잔치
            </span>
            <img
                class="user"
                id="header-profile-img"
                alt="user"
            />
            <div class="modal-menu" id="header-modal">
                <div class="modal-content">
                    <a class="modal-item" href="/update-info">
                        회원정보 수정
                    </a>
                    <a class="modal-item"
                        href="/update-password"
                    >
                        비밀번호 수정
                    </a>
                    <a class="modal-item logoutbtn"
                        href="/signin"
                    >
                        로그아웃
                    </a>
                </div>
            </div>
        `;
    }

    return header;
}
