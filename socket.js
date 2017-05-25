var app = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ctrlChat = require('./controllers/chat');

var usernames = {};

var rooms = ['Gym', 'BootCamp', 'Cycling', 'Rowing', 'Running', 'Triathalon'];

io.on('connection', function(socket){
    
    //FOR PRIVATE MESSAGES
    socket.on('newMessage', function(msg){
    	//socket.to(chat).emit('refresh messages', chat);
    });

    socket.on('enterChat', function(chat){
    	socket.join(chat);
    });

    //FOR CHAT ROOMS
    
    socket.on('addUser', function(username){
    	console.log('joining chat')
    	socket.username = username;
    	socket.room = 'Gym';
    	usernames[username] = username;
    	socket.join('Gym');
    	socket.emit('updateChat', 'SERVER', 'you have connected to Gym');
    	socket.broadcast.to('Gym').emit('updateChat', 'SERVER', username + ' has joined the room');
    	socket.emit('updateRooms', rooms, 'Gym');
        ctrlChat.connect(socket, socket.room);
    });

    socket.on('disconnect', function(){
    	ctrlChat.disconnect();
    	delete usernames[socket.username];
    	socket.emit('updateUsers', usernames);
    	socket.broadcast.emit('updateChat', 'SERVER', socket.username + ' has disconnected');
    	socket.leave(socket.room);
    });

    socket.on('sendChat', function(msg){
    	socket.to(socket.room).emit('updateChat', socket.username, msg);
    	socket.emit('updateChat', socket.username ,msg);
        ctrlChat.message(msg, socket.room, socket.username);
    });

    socket.on('switchRoom', function(newroom){
    	socket.leave(socket.room);
    	socket.join(newroom);
    	socket.emit('updateChat', 'SERVER', 'you have connected to ' + newroom);
    	socket.broadcast.to(socket.room).emit('updateChat', 'SERVER', socket.username + ' has left the room');
    	socket.room = newroom;
    	socket.broadcast.to(newroom).emit('updateChat', 'SERVER', socket.username + ' has joined the room');
    	socket.emit('updateRooms', rooms, newroom);
    })
});

module.exports = io;
