var mongoose = require('mongoose');

var chatRoomSchema = new mongoose.Schema(
    {user: String,
     message: String,
     time: Date
});

mongoose.model('ChatRoom', chatRoomSchema, 'chatRooms')