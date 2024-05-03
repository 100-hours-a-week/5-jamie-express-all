import fs from "fs";
import path from "path";
import getKoreanDateTime from "../utils/dateFormat.js";

const __dirname = path.resolve();
let usersJSON;

const createUser = ({ email, password, nickname, profile_image }) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8")
    );

    const lastUserId = usersJSON.length > 0 ? usersJSON[usersJSON.length - 1].user_id : 0;

    const newUser = {
        user_id: lastUserId + 1,
        email: email,
        password: password,
        nickname: nickname,
        profile_image: profile_image,
        created_at: getKoreanDateTime(),
    };
    usersJSON.push(newUser);
    saveUsers();

    return newUser.user_id;
};

const checkUser = ({ email, password }) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8")
    );

    const user = usersJSON.find(
        (user) => user.email === email && user.password === password
    );
    if (!user) {
        return "error: 유저 정보 없음";
    }

    return user.user_id;
};

const getUserById = (user_id) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8")
    );

    const user = usersJSON.find((user) => user.user_id === parseInt(user_id));
    if (!user) {
        return "error: 유저 정보 없음";
    }
    return user;
};

const updateUser = ({ user_id, update_form }) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8")
    );

    const user = usersJSON.find((user) => user.user_id === parseInt(user_id));
    if (!user) {
        return "error: 유저 정보 없음";
    }

    for (const key in update_form) {
        user[key] = update_form[key];
    }
    saveUsers();

    return user;
};

const updateUserPassword = ({ user_id, password }) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8")
    );

    const user = usersJSON.find((user) => user.user_id === parseInt(user_id));
    if (!user) {
        return "error: 유저 정보 없음";
    }

    user.password = password;
    saveUsers();

    return user;
};

const deleteUser = (user_id) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8")
    );

    const userIndex = usersJSON.findIndex((user) => user.user_id === parseInt(user_id));
    if (userIndex === -1) {
        return "error: 유저 정보 없음";
    }

    usersJSON.splice(userIndex, 1);
    saveUsers();

    return "delete success";
};

// ===== COMMON FUNCTIONS =====

function saveUsers() {
    fs.writeFileSync(
        path.join(__dirname, "data", "users.json"),
        JSON.stringify(usersJSON)
    );
}

// ===== EXPORT =====

export default {
    createUser,
    checkUser,
    getUserById,
    updateUser,
    updateUserPassword,
    deleteUser,
};
