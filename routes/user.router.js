const { Router } = require('express');

const userController = require('../controllers/user.controller');
const userMiddlewares = require('../middlewares/user.middleware');

const userRouter = Router();

userRouter.get('/', userController.getAllUser);
userRouter.post('/', userMiddlewares.newUserValidator, userMiddlewares.checkIsEmailDuplicate, userController.createUser);


userRouter.use('/:userIndex', userMiddlewares.getUserDynamically('userIndex', 'params', '_id'));
userRouter.get('/:userIndex', userController.getUserById);
userRouter.delete('/:userIndex', userController.getUserById);
userRouter.patch('/:userIndex', userController.getUserById);
userRouter.post('/:userIndex/photo', userMiddlewares.checkUserAvatar, userController.uploadUserPhoto);

userRouter.get('/pending', userController.getAllUser);

module.exports = userRouter;
