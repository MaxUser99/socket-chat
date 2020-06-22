const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const messages = [];

io
.of('/chat')
.on('connection', (socket) => {
    socket.join('room');

    socket.emit('messages', messages);

    socket.on('message', (message) => {
        const newMessage = { id: socket.id, message };
        messages.push(newMessage);
        io
        .of('/chat')
        .to('room')
        .emit('message', newMessage);
    });
});

app.use('/vendors', express.static('frontend/vendors'));
app.get('*', (req, res) => res.sendFile(__dirname + '/frontend/index.html'));

http.listen(3000, () => {
    console.log('listen on 3000 port');
});