const User = require('../models/User');

const userControllers = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error)
        }
    },
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete({ _id: req.params.id });
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = userControllers;