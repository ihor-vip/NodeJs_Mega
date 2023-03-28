const { FRONTEND_URL } = require('../config/config')
const { emailActionsEnum, actionTypesEnum } = require('../constants')
const { authService, emailService } = require('../services')
const OAuth = require('../dataBase/OAuth.model')
const ActionToken = require('../dataBase/ActionToken.model')
const User = require('Share/dataBase/User.model')

module.exports = {
  login: async (req, res, next) => {
    try {
      const { user, body: { password } } = req;

      await user.checkIsPasswordsSame(password);

      const tokenPair = authService.generateTokenPair({ userId: user._id });

      await OAuth.create({ user_id: user._id, ...tokenPair });

      res.json({
        ...tokenPair,
        user
      });
    } catch (e) {
      next(e)
    }
  },

  logout: async (req, res, next) => {
    try {
      await OAuth.deleteMany({ user_id: req.authUser._id });

      res.json('ok')
    } catch (e) {
      next(e);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { user: { _id, name } } = req;
      const token = authService.generateActionToken({ userId: _id });

      await ActionToken.create({
        token,
        user_id: _id,
        actionType: actionTypesEnum.FORGOT_PASSWORD
      });

      const forgotPasswordUrl = `${FRONTEND_URL}/password/forgot?token=${token}`
      await emailService.sendMail(
        'victor.fzs10@gmail.com',
        emailActionsEnum.FORGOT_PASSWORD,
        { forgotPasswordUrl, userName: name }
      )

      res.json('ok')
    } catch (e) {
      next(e);
    }
  },

  setPasswordAfterForgot: async (req, res, next) => {
    try {
      const { user, body } = req;

      const newPassword = await authService.hashPassword(body.password);

      await User.updateOne({ _id: user._id }, { password: newPassword });
      await OAuth.deleteMany({ user_id: user._id });
      await ActionToken.deleteOne({ token: body.token });

      res.json('ok');
    } catch (e) {
      next(e);
    }
  },
};
