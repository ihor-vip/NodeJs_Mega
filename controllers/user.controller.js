const User = require("../dataBase/User.model");

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);

        } catch (e) {
            res.status(404).json({message: e.message})
        }
    },

    createUser: async (req, res) => {
        try {
            const createdUser = await User.create(req.body);

            res.status(201).json(createdUser);

        } catch (e) {
            res.status(404).json({message: e.message})
        }
    },

    getUserById: async (req, res) => {
        try {
            const {id} = req.params;
            const user = await User.findById(id);

            if (!user) {
                res.status(404).json({message: 'No user found with that id'});
                return;
            }

            res.json(user);

        } catch (e) {
            res.status(404).json({message: e.message})
        }
    }
}