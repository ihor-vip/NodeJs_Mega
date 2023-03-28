const { smsActionsEnum } = require('../constants');

module.exports = {
  [smsActionsEnum.WELCOME]: (name) => `Hi ${name}, welcome on board`,
};
