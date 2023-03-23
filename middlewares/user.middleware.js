const User = require('../dataBase/User.model');
const ApiError = require('../error/ApiError');
const { userValidator } = require('../validators');

const checkIsEmailDuplicate = async (req, res, next) => {
  try {
    const { email } = req.body;

    const isUserPresent = await User.findOne({ email: email.toLowerCase().trim() });

    if (isUserPresent) {
      next(new ApiError('User with this email already present', 409));
      return;
    }

    next();
  } catch (e) {
    next(e);
  }
}

const checkIsUserPresent = async (req, res, next) => {
  try {
    const { userIndex } = req.params;

    const userById = await User.findById(userIndex);

    if (!userById) {
      next(new ApiError('User not found', 404));
      return
    }

    req.user = userById;

    next()
  } catch (e) {
    next(e)
  }
}

const newUserValidator = (req, res, next) => {
  try {
    const { error, value } = userValidator.newUserJoiSchema.validate(req.body);

    if (error) {
      next(new ApiError(error.details[0].message, 400));
      return;
    }

    req.body = value;

    next()
  } catch (e) {
    next(e)
  }
}

module.exports = {
  checkIsEmailDuplicate,
  checkIsUserPresent,
  newUserValidator
}
