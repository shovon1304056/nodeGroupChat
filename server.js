const path = require('path');
const express = require('express');

// cinfigure server
const http = require('http');
//socket

const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const dynamicFormatMessage = require('./utils/messages');
const { userJoinChat , getCurrentUser, getRoomUsers, userLeave } = require('./utils/users');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoinChat(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', dynamicFormatMessage(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        dynamicFormatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', dynamicFormatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    console.log(user);
    if (user) {
      io.to(user.room).emit(
        'message',
        dynamicFormatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});