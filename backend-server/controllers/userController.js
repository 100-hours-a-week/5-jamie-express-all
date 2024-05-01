import User from "../model/userModel.js";

const signUp = async (req, res) => {
    try {
        const profile_image = req.file;
        const { email, password, nickname } = req.body;

        const user_id = await User.createUser({
            email,
            password,
            nickname,
            profile_image
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

const getUserById = async (req, res) => {
    try {
        const user_id = req.headers.user_id;

        const user = await User.getUserById(user_id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export default { signUp, signIn, getUserById };
