const { Router } = require('express');

const { authController } = require('../controllers');
const { authMiddleware, userMiddleware } = require('../middlewares');

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

module.exports = authRouter;
