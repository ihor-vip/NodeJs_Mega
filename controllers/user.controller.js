const User = require('../dataBase/User.model');
const s3Service = require('../services/s3.service');

module.exports = {
  getAllUser: async (req, res, next) => {
    try {
      const { limit = 20, page = 1 } = req.query;
      const skip = (page - 1) * limit;

      const users = await User.find().limit(limit).skip(skip);
      const count = await User.count({});

      res.json({
        page,
        perPage: limit,
        data: users,
        count
      });
    } catch (e) {
      next(e);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const createdUser = await User.saveUserWithHashPassword(req.body);

      res.status(201).json(createdUser.toRepresentation());
    } catch (e) {
      next(e)
    }
  },

  getUserById: (req, res, next) => {
    try {
      res.json(req.user);
    } catch (e) {
      next(e);
    }
  },

  uploadUserPhoto: async (req, res, next) => {
    try {
      const avatar = req.files.avatar;
      const user = req.user;

      const stringPromise = await s3Service.uploadFile(avatar, 'user', user._id);

      res.json(stringPromise)
    } catch (e) {
      next(e);
    }
  }
}
