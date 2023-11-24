const socketIO = require('socket.io');

function handleSockets(server) {
  const io = socketIO(server);

  const users = {};

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('set username', (username) => {
      users[socket.id] = username;
      io.emit('user connected', username);
      io.emit('get users', Object.values(users));
    });

    socket.on('chat message', (msg) => {
      io.emit('chat message', { user: users[socket.id], message: msg });
    });

    socket.on('private chat', (selectedUser, msg) => {
      const sender = users[socket.id];
      const indetific = Object.keys(users).find(key => users[key] === selectedUser);
      if (indetific) {
        io.to(indetific).emit('private message', { user: sender, message: msg });
      }
    });

    socket.on('disconnect', () => {
      const disconnectedUser = users[socket.id];
      delete users[socket.id];
      io.emit('user disconnected', disconnectedUser);
      io.emit('get users', Object.values(users));
      console.log('A user disconnected');
    });
  });
}

module.exports = handleSockets;