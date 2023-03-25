const { authService } = require('../services')
const { authValidator } = require('../validators')
const OAuth = require('../dataBase/OAuth.model')
const ActionToken = require('../dataBase/ActionToken.model')
const ApiError = require('../error/ApiError')

async function checkAccessToken(req, res, next) {
  try {
    const access_token = req.get('Authorization');

    if (!access_token) {
      next(new ApiError('No token', 401));
      return;
    }

    authService.validateToken(access_token);

    const tokenData = await OAuth.findOne({ access_token }).populate('user_id');

    if (!tokenData || !tokenData.user_id) {
      next(new ApiError('Not valid token', 401));
      return;
    }

    req.authUser = tokenData.user_id;

    next();
  } catch (e) {
    next(e);
  }
}

function checkRefreshToken(req, res, next) {
  try {
    const token = 'hdjakjdjadljsTOKEN';

    authService.validateToken(token, 'refresh');

    next();
  } catch (e) {
    next(e);
  }
}

function isLoginDataValid(req, res, next) {
  try {
    const { value, error } = authValidator.loginSchema.validate(req.body);

    if (error) {
      next(new ApiError(error.details[0].message));
      return;
    }

    req.body = value;

    next();
  } catch (e) {
    next(e);
  }
}

function checkActionToken(actionType) {
  return async function(req, res, next) {
    try {
      const { token } = req.body;

      authService.validateToken(token, actionType);

      const tokenData = await ActionToken.findOne({ token, actionType }).populate('user_id');

      if (!tokenData || !tokenData.user_id) {
        return next(new ApiError('Token not valid'), 403);
      }

      req.user = tokenData.user_id;
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  checkAccessToken,
  checkRefreshToken,
  checkActionToken,
  isLoginDataValid,
};
