const {Router} = require('express');

const userController = require('../controllers/user.controller');
const userMiddlewares = require('../middlewares/user.midlleware');

const userRouter = Router();

userRouter.get('/', userController.getAllUsers);
userRouter.post('/', userMiddlewares.checkIsEmailDuplicate, userController.createUser);

userRouter.all('/:id', userMiddlewares.checkIsUserPresent);
userRouter.get('/:id', userController.getUserById);
userRouter.delete('/:id', userController.getUserById);
userRouter.patch('/:id', userController.getUserById);

module.exports = userRouter;
