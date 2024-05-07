const fs = require("fs");
const path = require("path");
const getKoreanDateTime = require("../utils/dateFormat.js");

let usersJSON;

const createUser = ({ email, password, nickname, profile_image }) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
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
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const user = usersJSON.find(
        (user) => user.email === email && user.password === password
    );
    if (!user) {
        return 400;
    }

    return user.user_id;
};

const getUserById = (user_id) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const user = usersJSON.find((user) => user.user_id === parseInt(user_id));
    if (!user) {
        return 400;
    }

    console.log("[USER] GET user by id: ", user.user_id);
    return user;
};

const updateUser = ({ user_id, profile_image, nickname }) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const userToUpdate = usersJSON.find((user) => user.user_id === parseInt(user_id));
    if (!userToUpdate) {
        return 400;
    }

    if (profile_image) {
        userToUpdate.profile_image = profile_image;
    }
    if (nickname) {
        userToUpdate.nickname = nickname;
    }
    saveUsers();

    console.log("[USER] UPDATE user: ", userToUpdate);
    return userToUpdate;
};

const updateUserPassword = ({ user_id, password }) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const userToUpdate = usersJSON.find((user) => user.user_id === parseInt(user_id));
    if (!userToUpdate) {
        return 400;
    }

    userToUpdate.password = password;
    saveUsers();

    console.log("[USER] update user password: ", userToUpdate);
    return userToUpdate;
};

const deleteUser = (user_id) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const userIndex = usersJSON.findIndex((user) => user.user_id === parseInt(user_id));
    console.log(userIndex);
    if (userIndex === -1) {
        return 400;
    }

    usersJSON.splice(userIndex, 1);
    saveUsers();

    console.log("[USER] delete user: ", user_id);
    return "delete success";
};

// ===== COMMON FUNCTIONS =====

function saveUsers() {
    fs.writeFileSync(
        path.join(__dirname, "../data", "users.json"),
        JSON.stringify(usersJSON)
    );
}

// ===== EXPORT =====

module.exports = {
    createUser,
    checkUser,
    getUserById,
    updateUser,
    updateUserPassword,
    deleteUser,
};
