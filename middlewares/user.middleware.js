const ApiError = require('@error');
const User = require('../dataBase/User.model');
const { userValidator } = require('../validators');
const { constants } = require('../constants');

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

// eslint-disable-next-line arrow-body-style
const getUserDynamically = (paramName = '_id', where = 'body', dataBaseField = paramName) => {
  return async (req, res, next) => {
    try {
      const findObject = req[where];

      if (!findObject || typeof findObject !== "object") {
        next(new ApiError('Wrong search param in middleware'));
        return;
      }

      const param = findObject[paramName];

      // TODO tell how to fix (normalization or extra find)
      const user = await User.findOne({ [dataBaseField]: param }).select("+password");

      if (!user) {
        next(new ApiError('User not found', 404));
        return
      }

      req.user = user;

      next()
    } catch (e) {
      next(e)
    }
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
    next(e);
  }
}

const checkUserAvatar = (req, res, next) => {
  try {
    if (!req.files || !req.files.avatar) {
      next(new ApiError('No file', 400));
      return;
    }

    const {size, mimetype} = req.files.avatar;

    if (size > constants.IMAGE_MAX_SIZE) {
      next(new ApiError(`Max file sile should be 5MB`, 400));
      return;
    }

    if (!constants.IMAGE_MIMETYPES.includes(mimetype)) {
      next(new ApiError(`Wrong file type`, 400));
      return;
    }

    next();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getUserDynamically,
  checkIsEmailDuplicate,
  newUserValidator,
  checkUserAvatar
}
