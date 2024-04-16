const loginButton = document.getElementById("login-btn");
const signupButton = document.getElementById("signup-btn");

const helperText = document.getElementById("login-helper");

function onLoginBtnClick(e) {
    e.preventDefault(); // form의 기본 제출 동작 방지

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email, password);

    // 클릭 시 색상이 바뀌고 3초 있다가 게시글 페이지로
    if (!validation({ email: email, password: password })) {
        helperText.textContent = "*입력하신 계정 정보가 정확하지 않았습니다.";
        return;
    } else {
        helperText.textContent = "";
        loginButton.style.backgroundColor = "#7F6AEE";
    }

    setTimeout(() => {
        window.location.href = "/public/html/post/list.html";
    }, 3000);
}

function onSignupBtnClick(e) {
    e.preventDefault(); // form의 기본 제출 동작 방지
}

function validation({ email, password }) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // 이메일 형식
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // 비밀번호 형식

    if (
        !email ||
        !emailRegex.test(email) ||
        !password ||
        !passwordRegex.test(password) ||
        password.length < 8 ||
        password.length > 20
    ) {
        return false;
    } else {
        return true;
    }
}
