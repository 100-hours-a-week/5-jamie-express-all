import { fetchForm, fetchRaw } from "../utils/fetch.js";
const SERVER_BASE_URL = "http://localhost:8000";

// ===== DOM Elements =====
const $updateButton = document.getElementById("update-info-btn");

const $profileImageLabelField = document.querySelector(
    ".profile-image-wrapper label img"
);
const $profileImageUploadField = document.getElementById("profile-image");

const $emailField = document.getElementById("email");
const $nicknameField = document.getElementById("nickname");
const $passwordField = document.getElementById("password");
const $passwordConfirmField = document.getElementById("password-confirm");

const $nicknameHelper = document.getElementById("nickname-helper");
const $passwordHelper = document.getElementById("password-helper");
const $passwordConfirmHelper = document.getElementById("password-confirm-helper");

const $withdrawalButton = document.getElementById("user-delete-btn");
const $modalCloseButton = document.getElementById("modal-cancel-btn");
const $modalConfirmButton = document.getElementById("modal-confirm-btn");

const $toast = document.getElementById("toast");
const $modal = document.querySelector(".modal");

const $modalBackdrop = document.querySelector(".modal-backdrop");

// ===== FUNCTIONS =====
let isProfileImageChanged = false;
let isNicknameChanged = false;
let nicknameValid, passwordValid, passwordConfirmValid;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*?&])[A-Za-z\d$@!%*?&]{8,20}$/;

window.addEventListener("DOMContentLoaded", async () => {
    await fetchRaw("/users", "GET")
        .then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    if ($emailField) {
                        // 회원정보 수정 페이지
                        $emailField.innerText = data.email;
                        $nicknameField.value = data.nickname;
                        $profileImageLabelField.src = `${SERVER_BASE_URL}/${data.profile_image.path}`;
                    }
                });
            } else if (res.status === 401) {
                alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                location.href = "/signin";
            }
        })
        .catch((error) => {
            console.error("유저 정보 불러오기 에러 발생: ", error);
        });
});

$nicknameField
    ? $nicknameField.addEventListener("blur", () => {
          updateValidation({ nickname: $nicknameField.value });
          isNicknameChanged = true;
          updateButtonStyle();
      })
    : null;
$profileImageUploadField
    ? $profileImageUploadField.addEventListener("change", (e) => {
          const image = e.target.files[0];
          $profileImageLabelField.src = URL.createObjectURL(image);
          isProfileImageChanged = true;
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

$updateButton
    ? $updateButton.addEventListener("click", async (e) => {
          e.preventDefault();

          if (isProfileImageChanged || (isNicknameChanged && nicknameValid)) {
              const formData = new FormData();
              formData.append("nickname", $nicknameField.value);
              formData.append("profile_image", $profileImageUploadField.files[0]);

              await fetchForm("/users/info", "PATCH", formData)
                  .then((res) => {
                      if (res.status === 200) {
                          toastOn();
                      } else {
                          alert("회원 정보 수정에 실패했습니다.");
                      }
                  })
                  .catch((error) => {
                      console.error("회원 정보 수정 에러 발생: ", error);
                  });
          } else if (passwordValid && passwordConfirmValid) {
              await fetchRaw("/users/password", "PATCH", {
                  password: $passwordField.value,
              })
                  .then((res) => {
                      if (res.status === 200) {
                          toastOn();
                      } else {
                          alert("회원 정보 수정에 실패했습니다.");
                      }
                  })
                  .catch((error) => {
                      console.error("회원 정보 수정 에러 발생: ", error);
                  });
          }
      })
    : null;
$withdrawalButton ? $withdrawalButton.addEventListener("click", showModal) : null;
$modalCloseButton ? $modalCloseButton.addEventListener("click", closeModal) : null;
$modalConfirmButton ? $modalConfirmButton.addEventListener("click", confirmDelete) : null;

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
    if (
        isProfileImageChanged ||
        (isNicknameChanged && nicknameValid) ||
        (passwordValid && passwordConfirmValid)
    ) {
        $updateButton.style.backgroundColor = "#7F6AEE";
        $updateButton.style.cursor = "pointer";
    } else {
        $updateButton.style.backgroundColor = "";
        $updateButton.style.cursor = "not-allowed";
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

async function confirmDelete(e) {
    e.preventDefault();

    await fetchRaw("/users", "DELETE")
        .then((res) => {
            if (res.status === 200) {
                withdrawalSuccess();
            } else {
                alert("회원 탈퇴에 실패했습니다.");
            }
        })
        .catch((error) => {
            console.error("회원 탈퇴 에러 발생: ", error);
        });

    alert("회원 탈퇴가 완료되었습니다.");
    location.href = "/signin";
}
