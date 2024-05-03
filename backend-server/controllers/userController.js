import User from "../model/userModel.js";

const signUp = async (req, res) => {
    try {
        const profile_image = req.file;
        const { email, password, nickname } = req.body;

        const user_id = await User.createUser({
            email,
            password,
            nickname,
            profile_image,
        });

        res.status(200).json(user_id);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user_id = await User.checkUser({ email, password });

        res.status(200).json(user_id);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

const withdrawal = async (req, res) => {
    try {
        const { user_id } = req.headers;

        const isSuccess = await User.deleteUser(user_id);

        if (isSuccess.startsWith("error")) {
            res.status(409).json({ message: isSuccess });
        } else {
            res.status(200).json({ message: "success" });
        }
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { user_id } = req.headers;

        const user = await User.getUserById(user_id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updateUserInfo = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const update_form = req.body;

        const updatedUser = await User.updateUser({ user_id, update_form });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

const updateUserPassword = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { password } = req.body;

        const updatedUser = await User.updateUserPassword({ user_id, password });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export default {
    signUp,
    signIn,
    getUserById,
    updateUserInfo,
    updateUserPassword,
    withdrawal,
};
