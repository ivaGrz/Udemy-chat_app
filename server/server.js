const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const escape = require('escape-html');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.Server(app);

// var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        console.log('join');

        const name = escape(params.name);
        const room = escape(params.room);
        if (!isRealString(name) || !isRealString(room)) {
            return callback('Name and room are required.');
        }
        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, name, room);

        io.to(room).emit('updateUserList', users.getUserList(room));

        socket.emit('adminMessage', 'Welcome to the chat app');

        socket.broadcast.to(room).emit('adminMessage', `${name} has joined.`);
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage');

        var user = users.getUser(socket.id);
        const messageText = escape(message.text);
        if (user && isRealString(messageText)) {
            socket.broadcast
                .to(user.room)
                .emit(
                    'newMessage',
                    generateMessage(user.name, messageText, user.color)
                );

            socket.emit(
                'meMessage',
                generateMessage('me', messageText, user.color)
            );
        }
        callback();
    });

    socket.on('createLocationMessage', data => {
        console.log('createLocationMessage');
        var user = users.getUser(socket.id);
        if (user) {
            console.log('userFound');
            socket.broadcast
                .to(user.room)
                .emit(
                    'newMessage',
                    generateLocationMessage(
                        user.name,
                        data.latitude,
                        data.longitude,
                        user.color
                    )
                );
            socket.emit(
                'meMessage',
                generateLocationMessage(
                    'me',
                    data.latitude,
                    data.longitude,
                    user.color
                )
            );
        }
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        const user = users.removeUser(socket.id);
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));

        io.to(user.room).emit('adminMessage', `${user.name} left the chat.`);
    });
});

server.listen(port, () => console.log(`Chat app listening on port ${port}!`));
