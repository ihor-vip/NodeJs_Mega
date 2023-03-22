const User = require("../dataBase/User.model");

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const {limit = 2, page = 1} = req.query;
      const skip = (page - 1) * limit;

      const users = await User.find().limit(limit).skip(skip);
      const count = await User.count({})

      res.status(200).json({
        page,
        perPage: limit,
        data: users,
        count
      });

    } catch (e) {
      next(e)
    }
  },

  createUser: async (req, res, next) => {
    try {
      const createdUser = await User.create(req.body);

      res.status(201).json(createdUser);

    } catch (e) {
      next(e)
    }
  },

  getUserById:  (req, res, next) => {
    try{

      res.json(req.user);

    } catch (e) {
      next(e)
    }
  }
}
