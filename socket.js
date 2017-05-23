var io = require('socket.io')();
var ctrlChat = require('./controllers/chat');

io.on('connection', function(socket){
    ctrlChat.connect(io,socket);
    socket.on('disconnect', ctrlChat.disconnect);
    socket.on('message', function(msg){ctrlChat.message(msg, io);});
});

module.exports = io;
