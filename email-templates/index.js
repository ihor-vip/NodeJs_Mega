const { emailActionsEnum } = require('../constants')

module.exports = {
  [emailActionsEnum.WELCOME]: {
    subject: 'Welcome on board',
    templateName: 'welcome'
  },

  [emailActionsEnum.ORDER_COMPLETE]: {
    subject: 'Your order is Complete',
    templateName: 'orderDone'
  },

  [emailActionsEnum.FORGOT_PASSWORD]: {
    subject: 'Forgot password?',
    templateName: 'forgotPassword'
  }
};
