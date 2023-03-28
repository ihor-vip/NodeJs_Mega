const axios = require('axios');

const User = require('../dataBase/User.model');
const smsUtils = require('../utils/sms.util');
const { s3Service, userService, cacheService, smsService } = require('../services');
const XXXError = require('@error');
const { deleteEndpointCache } = require("../services/cache.service");
const { smsActionsEnum } = require('../constants');

module.exports = {
  getAllUser: async (req, res, next) => {
    try {
      const paginationResponse = await userService.getUsersWithCount(req.query);

      res.json(paginationResponse);
    } catch (e) {
      next(e);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const createdUser = await User.saveUserWithHashPassword(req.body);

      const message = smsUtils[smsActionsEnum.WELCOME](createdUser.name);

      await smsService.sendSMS(createdUser.phone, message);

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

  updateUser: async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.userIndex, req.body, {new: true});

      deleteEndpointCache(req.originalUrl);

      res.json(user);
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
  },

  getUsersFromRedis: async (req, res, next) => {
    try {
      const users = [];

      for await (const key of cacheService.client.scanIterator()) {
        const user = await cacheService.client.get(key)
        users.push(user)
      }

      res.json(users);
    } catch (e) {
      next(e)
    }
  },

  setUserToRedis: async (req, res, next) => {
    try {
      const {name} = req.body;
      await cacheService.client.set(name, JSON.stringify(req.body));

      res.json();
    } catch (e) {
      next(e)
    }
  },

  getUserByNameFromRedis: async (req, res, next) => {
    try {

      const { name } = req.params;

      const user = await cacheService.client.get(name);

      if (!user) {
        return next(new XXXError('User not found', 404));
      }

      res.json(JSON.parse(user));
    } catch (e) {
      next(e);
    }
  },

  getJSONUsers: async (req, res, next) => {
    try {
      const photos = await axios.get('https://jsonplaceholder.typicode.com/photos');

      res.json(photos.data);
    } catch (e) {
      next(e)
    }
  }
}
