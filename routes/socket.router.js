const { socketController } = require("../controllers");

module.exports = (io, socket) => {
  console.log('******************************');
  console.log(socket.id);
  console.log('******************************');

  socket.use((infoArr, next) => {
    console.log(infoArr);

    console.log('_________________________________________');
    console.log(socket.handshake.query.token);
    console.log('_________________________________________');

    const [
      event,
      ...data
    ] = infoArr;

    console.log(event);

    if (event.startsWith('message:')) {
      console.log('SOCKET MESSAGE ROUTER');

      return;
    }

    if (event.startsWith('broadcast:')) {
      console.log('SOCKET BROADCAST ROUTER');

      socket.on('broadcast:to:all', (data) => socketController.broadcastToAllUser(io, socket, data));

      socket.on('broadcast:not:me', () => socketController.broadcastAvoidSender(io, socket));

      return;
    }

    next();
  });


  socket.on('message:create', (data) => socketController.sendMessage(io, socket, data));
};
