var io = require('socket.io')();
var ctrlChat = require('./controllers/chat');

var usernames = {};

var rooms = ['room1', 'room2'];

io.on('connection', function(socket){
    
    socket.on('addUser', function(username){
    	socket.username = username;
    	socket.room = 'room1';
    	usernames[username] = username;
    	socket.join('room1');
    	socket.emit('updateChat', 'SERVER', 'you have connected to room1');
    	socket.broadcast.to('room1').emit('updateChat', 'SERVER', username + ' has joined the room');
    	socket.emit('updateRooms', rooms, 'room1');
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
