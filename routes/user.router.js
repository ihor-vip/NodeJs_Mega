const {Router} = require('express');

const userController = require('../controllers/user.controller');
const userMiddlewares = require('../middlewares/user.midlleware');

const userRouter = Router();

userRouter.get('/', userController.getAllUsers )

userRouter.post('/', userMiddlewares.checkIsEmailDuplicate, userController.createUser )

userRouter.get('/:id', userController.getUserById )

module.exports = userRouter;