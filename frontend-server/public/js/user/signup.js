import { fetchRaw, fetchForm } from "../utils/fetch.js";

// ===== DOM Elements =====
const $signupButton = document.getElementById("signup-btn");

const $emailHelper = document.getElementById("email-helper");
const $passwordHelper = document.getElementById("password-helper");
const $passwordConfirmHelper = document.getElementById("password-confirm-helper");
const $nicknameHelper = document.getElementById("nickname-helper");
const $profileImageHelper = document.getElementById("profile-image-helper");

const $emailField = document.getElementById("email");
const $passwordField = document.getElementById("password");
const $passwordConfirmField = document.getElementById("password-confirm");
const $nicknameField = document.getElementById("nickname");
const $profileImageUploadField = document.getElementById("profile-image");
const $profileImageLabelField = document.querySelector(
    ".profile-image-wrapper label img"
);

const $emailCheckButton = document.getElementById("email-check-btn");
const $nicknameCheckButton = document.getElementById("nickname-check-btn");

// ===== REGEX =====
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

// ===== FUNCTIONS =====
let emailValid, passwordValid, passwordConfirmValid, nicknameValid;

// 포커스 아웃 시 유효성 검사 & button 업데이트
$emailField.addEventListener("input", () => {
    signUpValidation({ email: $emailField.value });
    updateButtonStyle();
});
$passwordField.addEventListener("input", () => {
    signUpValidation({ password: $passwordField.value });
    updateButtonStyle();
});
$passwordConfirmField.addEventListener("input", () => {
    signUpValidation({ passwordConfirm: $passwordConfirmField.value });
    updateButtonStyle();
});
$nicknameField.addEventListener("input", () => {
    signUpValidation({ nickname: $nicknameField.value });
    updateButtonStyle();
});
$profileImageUploadField.addEventListener("change", (e) => {
    const image = e.target.files[0];

    if (!image) {
        $profileImageHelper.textContent = "*프로필 사진을 추가해주세요.";
        $profileImageLabelField.src = "../../images/icons/plus.png";
        return;
    }

    $profileImageHelper.textContent = "";
    $profileImageLabelField.src = URL.createObjectURL(image);
});

$emailCheckButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const inputEmail = $emailField.value;
    if (!emailValid) {
        return;
    }

    await fetchRaw(`/users/email-check/${inputEmail}`, "GET").then((res) => {
        if (res.status === 401) {
            $emailHelper.textContent = "*중복된 이메일입니다.";
            $emailField.placeholder = inputEmail;
            $emailField.value = "";
            emailValid = false;
        } else if (res.status === 200) {
            $emailHelper.textContent = "";
            emailValid = true;
            alert("사용 가능한 이메일입니다.");
        }
    });
});

$nicknameCheckButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const inputNickname = $nicknameField.value;
    if (!nicknameValid) {
        return;
    }

    await fetchRaw(`/users/nickname-check/${inputNickname}`, "GET").then((res) => {
        if (res.status === 401) {
            $nicknameHelper.textContent = "*중복된 닉네임입니다.";
            $nicknameField.placeholder = inputNickname;
            $nicknameField.value = "";
            nicknameValid = false;
        } else if (res.status === 200) {
            $nicknameHelper.textContent = "";
            nicknameValid = true;
            alert("사용 가능한 닉네임입니다.");
        }
    });
});

function signUpValidation({ email, password, passwordConfirm, nickname }) {
    $emailHelper.textContent = "";
    $passwordHelper.textContent = "";
    $passwordConfirmHelper.textContent = "";
    $nicknameHelper.textContent = "";

    if (email !== undefined) {
        if (email === "") {
            emailValid = false;
            $emailHelper.textContent = "*이메일을 입력해주세요.";
        } else if (!emailRegex.test(email)) {
            emailValid = false;
            $emailHelper.textContent =
                "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
        } else {
            emailValid = true;
            $emailHelper.textContent = "";
        }
    }

    if (password !== undefined) {
        if (password === "") {
            passwordValid = false;
            $passwordHelper.textContent = "*비밀번호를 입력해주세요.";
        } else if (!passwordRegex.test(password)) {
            passwordValid = false;
            $passwordHelper.textContent =
                "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        } else {
            passwordValid = true;
            $passwordHelper.textContent = "";
        }
    }

    if (passwordConfirm !== undefined) {
        if (passwordConfirm === "") {
            passwordConfirmValid = false;
            $passwordConfirmHelper.textContent = "*비밀번호를 다시 입력해주세요.";
        } else if (passwordConfirm !== $passwordField.value) {
            passwordConfirmValid = false;
            $passwordConfirmHelper.textContent = "*비밀번호가 다릅니다.";
            $passwordHelper.textContent = "*비밀번호가 다릅니다.";
        } else {
            passwordConfirmValid = true;
            $passwordConfirmHelper.textContent = "";
            $passwordHelper.textContent = "";
        }
    }

    if (nickname !== undefined) {
        if (nickname === "") {
            nicknameValid = false;
            $nicknameHelper.textContent = "*닉네임을 입력해주세요.";
        } else if (nickname.includes(" ")) {
            nicknameValid = false;
            $nicknameHelper.textContent = "*띄어쓰기를 없애주세요.";
        } else if (nickname.length >= 11) {
            nicknameValid = false;
            $nicknameHelper.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
        } else {
            nicknameValid = true;
            $nicknameHelper.textContent = "";
        }
    }
}

function updateButtonStyle() {
    if (emailValid && passwordValid && passwordConfirmValid && nicknameValid) {
        $signupButton.style.backgroundColor = "#7F6AEE";
        $signupButton.style.cursor = "pointer";
    } else {
        $signupButton.style.backgroundColor = "";
        $signupButton.style.cursor = "not-allowed";
    }
}

$signupButton.addEventListener("click", (e) => {
    e.preventDefault(); // form의 기본 제출 동작 방지"

    const formData = new FormData();
    formData.append("email", $emailField.value);
    formData.append("password", $passwordField.value);
    formData.append("nickname", $nicknameField.value);
    formData.append("profile_image", $profileImageUploadField.files[0]);

    fetchForm("/users/signup", "POST", formData)
        .then((res) => {
            if (res.status === 200) {
                alert("회원가입이 완료되었습니다.");
                location.href = "/signin";
            }
        })
        .catch((error) => {
            console.error("회원가입 중 에러 발생:", error);
        });
});
