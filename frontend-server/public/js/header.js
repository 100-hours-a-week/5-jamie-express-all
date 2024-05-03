function HeaderNotLoggedIn() {
    return (
        <span class="header-title" onclick="location.reload()">
            아무 말 대잔치
        </span>
    );
}

function Header() {
    return (
        <div class="block">
            <span class="header-title" onclick="location.reload()">
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
                    <a class="modal-item" href="/update-pwd">
                        비밀번호 수정
                    </a>
                    <a class="modal-item logoutbtn" href="/signin">
                        로그아웃
                    </a>
                </div>
            </div>
        </div>
    );
}

export { HeaderNotLoggedIn, Header };
