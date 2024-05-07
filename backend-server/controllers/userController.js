const User = require("../model/userModel.js");

const signUp = async (req, res) => {
    const profile_image = req.file;
    const { email, password, nickname } = req.body;

    const user_id = await User.createUser({
        email,
        password,
        nickname,
        profile_image,
    });

    res.status(200).json({ user_id: user_id });
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    const status = await User.checkUser({ email, password });

    if (status === 401) {
        res.status(401).json({ message: "유저 정보 없음" });
    } else {
        res.status(200).json({ user_id: status });
    }
};

const withdrawal = async (req, res) => {
    const { user_id } = req.headers;

    const isSuccess = await User.deleteUser(user_id);

    if (isSuccess === 400) {
        res.status(400).json({ message: "유저 정보 없음" });
    } else {
        res.status(200).json({ message: "회원 탈퇴 완료" });
    }
};

const getUserById = async (req, res) => {
    const { user_id } = req.headers;

    const user = await User.getUserById(user_id);

    if (user === 400) {
        res.status(400).json({ message: "유저 정보 없음" });
    } else {
        res.status(200).json(user);
    }
};

const updateUserInfo = async (req, res) => {
    const { user_id } = req.headers;
    const profile_image = req.file;
    const { nickname } = req.body;

    const updatedUser = await User.updateUser({ user_id, profile_image, nickname });

    if (updatedUser === 400) {
        res.status(400).json({ message: "유저 정보 없음 (user_id 오류)" });
    } else {
        res.status(200).json(updatedUser);
    }
};

const updateUserPassword = async (req, res) => {
    const { user_id } = req.headers;
    const { password } = req.body;

    const updatedUser = await User.updateUserPassword({ user_id, password });

    res.status(200).json(updatedUser);
};

module.exports = {
    signUp,
    signIn,
    getUserById,
    updateUserInfo,
    updateUserPassword,
    withdrawal,
};
