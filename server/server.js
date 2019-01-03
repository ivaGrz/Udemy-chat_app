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

    socket.on('createMessage', message => {
        console.log('Created Message: ', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: Date.now()
        });
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
);
