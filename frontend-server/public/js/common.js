// ===== Header =====
document.addEventListener("DOMContentLoaded", function () {
    const $headerContainer = document.querySelector(".header-container");

    // TODO: 로그인 상태 확인
    const isLoggedIn = true;

    const headerElement = createHeader(isLoggedIn);
    $headerContainer.appendChild(headerElement);
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
            src="../images/userimage.png"
            alt="user"
        />
        <div class="modal-menu" id="header-modal">
            <div class="modal-content">
                <a class="modal-item" href="/update-info">
                    회원정보 수정
                </a>
                <a class="modal-item"
                    href="/update-pwd"
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

// ===== Header Modal =====

const $headerModal = document.getElementById("header-modal");
document.getElementById("header-profile-img").addEventListener("click", () => {
    if ($headerModal.style.display === "block") {
        $headerModal.style.display = "none";
    } else {
        $headerModal.style.display = "block";
    }
});
