import { fetchRaw } from "../utils/fetch.js";

// ===== DOM Elements =====
const $loginButton = document.getElementById("login-btn");
const $loginHelper = document.getElementById("login-helper");

const $emailField = document.getElementById("email");
const $passwordField = document.getElementById("password");

// ===== REGEX =====
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ===== FUNCTIONS =====
let emailValid, passwordValid;

// 입력 중 유효성 검사
$emailField.addEventListener("input", () => {
    loginValidation({ email: $emailField.value });
});
$passwordField.addEventListener("input", () => {
    loginValidation({ password: $passwordField.value });
});

// 포커스 아웃 시 유효성 검사 & helper 업데이트
$emailField.addEventListener("blur", () => {
    loginValidation({ email: $emailField.value });
    updateHelper();
});
$passwordField.addEventListener("blur", () => {
    loginValidation({ password: $passwordField.value });
    updateHelper();
});

$loginButton.addEventListener("click", (e) => {
    e.preventDefault(); // form의 기본 제출 동작 방지

    fetchRaw("/users/signin", "POST", {
        email: $emailField.value,
        password: $passwordField.value,
    })
        .then((res) => {
            if (res.status === 200) {
                location.href = "/";
            } else if (res.status === 401) {
                $loginHelper.textContent = "*입력하신 계정 정보가 정확하지 않습니다.";
                $emailField.value = "";
                $passwordField.value = "";
                return;
            }
        })
        .catch((error) => {
            console.error("로그인 에러 발생: ", error);
        });
});

function loginValidation({ email, password }) {
    if (email !== undefined) {
        emailValid = email === "" ? false : emailRegex.test(email);
    }
    if (password !== undefined) {
        passwordValid =
            password === "" || password.length < 8 || password.length > 20
                ? false
                : passwordRegex.test(password);
    }

    updateButtonStyle();
}

function updateHelper() {
    if (emailValid && passwordValid) {
        $loginHelper.textContent = "";
    } else if (emailValid === false || passwordValid === false) {
        $loginHelper.textContent = "*입력하신 계정 정보가 정확하지 않습니다.";
    } else if (emailValid || passwordValid) {
        $loginHelper.textContent = "";
    }
}

function updateButtonStyle() {
    if (emailValid && passwordValid) {
        $loginButton.style.backgroundColor = "#7F6AEE";
        $loginButton.style.cursor = "pointer";
    } else {
        $loginButton.style.backgroundColor = "";
        $loginButton.style.cursor = "not-allowed";
    }
}
