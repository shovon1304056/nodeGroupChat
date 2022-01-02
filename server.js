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

// set static folder for frontend view

app.use(express.static(path.join(__dirname, 'public')));
//bot name

const botName = 'Node Bot'

// Run when a user connects
io.on('connection', socket => {

    // join on chat room
    socket.on('joinRoom', ({ username, room }) => {

    const user = userJoinChat(socket.id,username,room);
    socket.join(user.room);

    // when a user joins, only single message
    socket.emit('message' , dynamicFormatMessage(botName ,'Welcome to the chat app')); 

    // Broadcast when any other user joins,  
    // all user except the new joinee will see the message

    socket.broadcast.to(user.room).
        emit('message', dynamicFormatMessage(botName ,`${user.username} joined`));

        // send users and room details
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users : getRoomUsers(user.room)
    });
    });

    

    // receive the chat message
    socket.on('chatMessage', msg => {

        const getUser = getCurrentUser(socket.id);
        console.log(msg);
        io.to(getUser.room).emit('message', dynamicFormatMessage(getUser.username ,msg));
    });

    // show message when clients disconnect
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if(user){
            console.log(user);
            io.to(user.room)
                .emit('message', dynamicFormatMessage(botName ,`${user.username} has left`));

    // send users and rood details
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users : getRoomUsers(user.room)
    });
        }

    
        
    });

});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});