const { socketController } = require("../controllers");

module.exports = (io, socket) => {
  console.log(socket.id, 'connected');

  socket.on('disconnecting', () => {
    socket.leaveAll()
    console.log(socket.id, 'disconnecting');
  })

  socket.use((infoArr, next) => {
    console.log(infoArr);

    console.log('_________________________________________');
    console.log(socket.handshake.query.token);
    console.log('_________________________________________');

    // getUserByToken

    // Update user socketId // 3 => 10

    const [
      event,
      ...data
    ] = infoArr;

    console.log(event);

    if (event.startsWith('message:')) {
      console.log('SOCKET MESSAGE ROUTER');

      return next();
    }

    if (event.startsWith('broadcast:')) {
      console.log('SOCKET BROADCAST ROUTER');

      socket.on('broadcast:to:all', (data) => socketController.broadcastToAllUser(io, socket, data));

      socket.on('broadcast:not:me', () => socketController.broadcastAvoidSender(io, socket));

      // do not forget to call next
      return next()
    }
  });


  socket.on('message:create', (data) => socketController.sendMessage(io, socket, data));
};
