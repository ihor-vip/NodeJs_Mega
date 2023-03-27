const { Router } = require('express');
const { chatController } = require("../controllers");
const { authMiddleware } = require("../middlewares");

const chatRouter = Router();

chatRouter.use(authMiddleware.checkAccessToken);

chatRouter.post('/', chatController.createChat);

// chatRouter.use('/:chatId', chatMdlwr.checkIsChatPresent);
chatRouter.get('/:chatId', chatController.getChatInfo);
chatRouter.post('/:chatId/join', chatController.joinChat);
chatRouter.post('/:chatId/leave', chatController.leaveChat);

chatRouter.delete('/:chatId', chatController.joinChat);
chatRouter.put('/:chatId', chatController.joinChat);

module.exports = chatRouter;
