const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

const users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Обработка нового пользователя и отправка списка пользователей
  socket.on('set username', (username) => {
    
    users[socket.id] = username;
    io.emit('user connected', username);
    io.emit('get users', Object.values(users));
  });

  // Обработка отправки сообщений
  socket.on('chat message', (msg) => {
    io.emit('chat message', { user: users[socket.id], message: msg });
  });

  // Обработка выбора подключенного клиента и отправка ему приватного сообщения
  socket.on('private chat', (selectedUser, msg) => {
    const sender = users[socket.id];
    
    const indetific = Object.keys(users).find(key => users[key] === selectedUser);
    //const targetSocket = io.sockets.connected[indetific];
  
    console.log(users[socket.id]);
    console.log(selectedUser);
    //console.log(targetSocket);
  
    if (indetific) {
      io.to(indetific).emit('private message', { user: sender, message: msg });
    }
  });

  // Обработка отключения клиента
  socket.on('disconnect', () => {
    const disconnectedUser = users[socket.id];
    delete users[socket.id];
    io.emit('user disconnected', disconnectedUser);
    io.emit('get users', Object.values(users));
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});