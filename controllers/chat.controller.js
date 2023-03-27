const Chat2User = require('../dataBase/ChatRoom2User');
const Chat = require('../dataBase/ChatRoom');

module.exports = {
  joinChat: async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const { _id } = req.authUser;

      await Chat2User.create({ chat: chatId, user: _id });

      // const socketId = GetUserSocketId(_id);

      // const userSocket = global.io.sockets.sockets.get(socketId));

      // userSocket.join(chatId);
      // io.broadcast.to(chatId).emit('room:join', { user: req.authUser });

      res.json('Ok')
    } catch (e) {
      next(e);
    }
  },

  leaveChat: async (req, res, next) => {
    try {
      const { chatId } = req.params;
      const { _id } = req.authUser;

      await Chat2User.remove({ chat: chatId, user: _id })

      // socket.leave(chatId);
      // io.broadcast.to(chatId).emit('room:leave', { user: req.authUser });

      res.json('Ok')
    } catch (e) {
      next(e);
    }
  },

  getChatInfo: async (req, res, next) => {
    try {
      const { chatId } = req.params;

      const chat = await Chat.findById(chatId);

      res.json(chat)
    } catch (e) {
      next(e);
    }
  },

  createChat: async (req, res, next) => {
    try {
      const { _id } = req.authUser;

      const createdChat = await Chat.create({ ...req.body, creator: _id });
      await Chat2User.create({ chat: createdChat._id, user: _id });

      // console.log(global.io.sockets.sockets.get(socketId));

      // socket.join(createdChat._id);
      global.io.emit('chat:create', { user: req.authUser, chat: createdChat });

      res.json(createdChat)
    } catch (e) {
      next(e);
    }
  }
};
