// ===== DOM Elements =====
const $updateButton = document.getElementById("update-info-btn");

const $nicknameField = document.getElementById("nickname");
const $passwordField = document.getElementById("password");
const $passwordConfirmField = document.getElementById("password-confirm");

const $nicknameHelper = document.getElementById("nickname-helper");
const $passwordHelper = document.getElementById("password-helper");
const $passwordConfirmHelper = document.getElementById("password-confirm-helper");

const $toast = document.getElementById("toast");
const $modal = document.querySelector(".modal");

const $modalBackdrop = document.querySelector(".modal-backdrop");

// ===== FUNCTIONS =====
let nicknameValid, passwordValid, passwordConfirmValid;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*?&])[A-Za-z\d$@!%*?&]{8,20}$/;

$nicknameField
    ? $nicknameField.addEventListener("blur", () => {
          updateValidation({ nickname: $nicknameField.value });
          updateButtonStyle();
      })
    : null;
$passwordField
    ? $passwordField.addEventListener("blur", () => {
          updateValidation({
              password: $passwordField.value,
              passwordConfirm: $passwordConfirmField.value,
          });
          updateButtonStyle();
      })
    : null;
$passwordConfirmField
    ? $passwordConfirmField.addEventListener("blur", () => {
          updateValidation({
              password: $passwordField.value,
              passwordConfirm: $passwordConfirmField.value,
          });
          updateButtonStyle();
      })
    : null;

function updateValidation({ nickname, password, passwordConfirm }) {
    if (nickname != null) {
        // falsy값(0, '', null, undefined, NaN)이 아닌 경우
        if (nickname.length === 0 || nickname.includes(" ")) {
            $nicknameHelper.textContent = "*닉네임을 입력해주세요.";
            return;
        } else if (nickname.length > 11) {
            $nicknameHelper.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
            return;
        } else {
            nicknameValid = true;
            $nicknameHelper.textContent = "";
        }
    }

    if (password != null && passwordConfirm != null) {
        if (password.length === 0) {
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

        if (passwordConfirm.length === 0) {
            passwordConfirmValid = false;
            $passwordConfirmHelper.textContent = "*비밀번호를 한 번 더 입력해주세요.";
            return;
        } else if (password !== passwordConfirm) {
            passwordConfirmValid = false;
            $passwordConfirmHelper.textContent = "*비밀번호와 다릅니다.";
            $passwordHelper.textContent = "*비밀번호 확인과 다릅니다.";
            return;
        } else if (passwordValid) {
            passwordConfirmValid = true;
            $passwordConfirmHelper.textContent = "";
            $passwordHelper.textContent = "";
        } else {
            $passwordConfirmHelper.textContent = "";
        }
    }
}

function updateButtonStyle() {
    if (nicknameValid || (passwordValid && passwordConfirmValid)) {
        $updateButton.style.backgroundColor = "#7F6AEE";
        $updateButton.style.cursor = "pointer";
    } else {
        $updateButton.style.backgroundColor = "";
        $updateButton.style.cursor = "not-allowed";
    }
}

function onClickUpdateInfoBtn(e) {
    e.preventDefault();

    if (nicknameValid || (passwordValid && passwordConfirmValid)) {
        toastOn();
    }
}

function toastOn() {
    $toast.style.display = "flex";
    setTimeout(() => {
        $toast.style.display = "none";
    }, 2000);
}

function showModal(e) {
    e.preventDefault();
    $modal.style.display = "flex";
    $modalBackdrop.style.display = "block";
}

function closeModal(e) {
    e.preventDefault();
    $modal.style.display = "none";
    $modalBackdrop.style.display = "none";
}

function confirmDelete(e) {
    e.preventDefault();

    alert("회원 탈퇴가 완료되었습니다.");
    window.location.href = "/public/views/user/signin.html";
}
