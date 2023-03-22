const User = require('../dataBase/User.model');
const ApiError = require('../error/apiError')

const checkIsEmailDuplicate = async (req, res, next) => {
  try {
    const {email = ''} = req.body;

    if (!email) {
      next(new ApiError ('Email is required', 400));
      return
    }

    const isUserPresent = await User.findOne({email: email.toLowerCase().trim()});

    if (isUserPresent) {
      throw new ApiError('User with this email already exist', 409);
    }

    next();
  } catch (e) {
    next(e)
  }
}

const checkIsUserPresent =async (req, res, next) => {
  try {
    const {id} = req.params;

    const userById = await User.findById(id);

    if (!userById) {
      next(new ApiError('User not found', 404))
      return
    }

    req.user = userById

    next()
  } catch (e) {
    next (e)
  }
}

module.exports = {
  checkIsEmailDuplicate, checkIsUserPresent
};

