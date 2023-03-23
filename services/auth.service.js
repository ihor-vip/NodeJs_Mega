const bcrypt = require('bcrypt');

const ApiError = require('../error/ApiError');

async function comparePasswords(hashPassword, password) {
  const isPasswordSame = await bcrypt.compare(password, hashPassword);

  if (!isPasswordSame) {
    throw new ApiError('Wrong password', 400);
  }
}

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

module.exports = {
  comparePasswords,
  hashPassword
}
