module.exports = {
  sendMessage: (io, socket, data) => {
    console.log('ESSAGE CREATED');
    console.log(data);

    socket.emit('message:save', data);
  },

  // Broadcast to all users
  broadcastToAllUser: (io, socket, data) => {
    console.log('BROAD EMITED')

    socket.join('room1');

    io.emit('broadcast:all', {broadcast: 'ALL'});
  },

  // Broadcast to all users avoid sender
  broadcastAvoidSender: (io, socket) => {
    socket.broadcast.emit('broadcast:all:not:me', {})

    io.to('room1').emit('asda', 'adads');

    socket.leave('room1');
  }
}
