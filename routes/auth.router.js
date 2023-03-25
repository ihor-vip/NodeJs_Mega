const { Router } = require('express');

const { authController } = require('../controllers');
const { authMiddleware, userMiddleware } = require('../middlewares');
const { actionTypesEnum } = require("../constants");

const authRouter = Router();

authRouter.post(
  '/login',
  authMiddleware.isLoginDataValid,
  userMiddleware.getUserDynamically('email'),
  authController.login
);

authRouter.post(
  '/logout',
  authMiddleware.checkAccessToken,
  authController.logout
)

authRouter.post('/password/forgot', userMiddleware.getUserDynamically('email'), authController.forgotPassword)

authRouter.patch(
  '/password/forgot',
  authMiddleware.checkActionToken(actionTypesEnum.FORGOT_PASSWORD),
  authController.setPasswordAfterForgot
)

module.exports = authRouter;
