const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('New user connected');
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app',
        createdAt: Date.now()
    });
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined',
        createdAt: Date.now()
    });

    socket.on('createMessage', message => {
        console.log('Created Message: ', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: Date.now()
        });
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: Date.now()
        // });
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        socket.broadcast.emit('newMessage', {
            from: 'Admin',
            text: 'User left chat app'
        });
    });
});

server.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
);
