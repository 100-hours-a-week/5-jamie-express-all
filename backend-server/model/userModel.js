import fs from "fs";
import path from "path";
import getKoreanDateTime from "../utils/dateFormat.js";

const __dirname = path.resolve();
let usersJSON;

const createUser = ({ email, password, nickname, profile_image }) => {
    usersJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8"));
    const newUser = {
        user_id: usersJSON.length + 1, // 회원 삭제 후 생성하면 user id 중복될 수 있음
        email: email,
        password: password,
        nickname: nickname,
        profile_image: profile_image,
        created_at: getKoreanDateTime()
    };
    usersJSON.push(newUser);
    saveUsers();

    return newUser.user_id;
};

const checkUser = ({ email, password }) => {
    usersJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8"));

    const user = usersJSON.find((user) => user.email === email && user.password === password);
    if (!user) {
        return "error: 유저 정보 없음";
    }
    return user.user_id;
};

const getUserById = (user_id) => {
    usersJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8"));

    const user = usersJSON.find((user) => user.user_id === parseInt(user_id));
    if (!user) {
        return "error: 유저 정보 없음";
    }
    return user;
};

// ===== COMMON FUNCTIONS =====

function saveUsers() {
    fs.writeFileSync(path.join(__dirname, "data", "users.json"), JSON.stringify(usersJSON));
}

// ===== EXPORT =====

export default { createUser, checkUser, getUserById };
