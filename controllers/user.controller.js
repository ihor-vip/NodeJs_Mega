const DB = require("../dataBase/users");

module.exports = {
    getAllUsers: (req, res) => {
        res.status(200).json(DB)
    },

    createUser: (req, res) => {
        DB.push(req.body)

        res.json(DB)
    },

    getUserById: (req, res) => {
        const {id} = req.params;
        const user = DB[id];

        if (!user) {
            res.status(404).json(`User with id ${id} not found`);
            return;
        }

        res.json(user);
    }
}