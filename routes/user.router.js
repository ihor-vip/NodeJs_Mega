
const { Router } = require('express');

const userController = require('../controllers/user.controller');
const {cacheService} = require('../services');
const userMiddlewares = require('@middlewares/user.middleware');

const userRouter = Router();

userRouter.get('/', userController.getAllUser);
userRouter.post('/', userMiddlewares.newUserValidator, userMiddlewares.checkIsEmailDuplicate, userController.createUser);

userRouter.get('/redis', userController.getUsersFromRedis);
userRouter.post('/redis', userController.setUserToRedis);
userRouter.get(
  '/redis/json',
  cacheService.redisCache.route({expire: 3600}),
  userController.getJSONUsers
);
userRouter.get('/redis/:name', userController.getUserByNameFromRedis);

userRouter.use('/:userIndex', userMiddlewares.getUserDynamically('userIndex', 'params', '_id'));
userRouter.get('/:userIndex', cacheService.redisCache.route({expire: 3600}), userController.getUserById);
userRouter.delete('/:userIndex', userController.getUserById);
userRouter.patch('/:userIndex', userController.updateUser);
userRouter.post('/:userIndex/photo', userMiddlewares.checkUserAvatar, userController.uploadUserPhoto);

userRouter.get('/pending', userController.getAllUser);

module.exports = userRouter;
