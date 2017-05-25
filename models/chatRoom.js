var mongoose = require('mongoose');

var chatRoomSchema = new mongoose.Schema(
    {chatName: String
});

mongoose.model('ChatRoom', chatRoomSchema, 'chatRooms');