const User = require('../dataBase/User.model');
const ApiError = require('../error/apiError')

const checkIsEmailDuplicate = async (req, res, next) => {
    try {
        const {email = ''} = req.body;

        if (!email) {
            throw new ApiError ('Email is required', 400);
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

module.exports = {
    checkIsEmailDuplicate
};