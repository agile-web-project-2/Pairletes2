var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema(
    {
    chatParticipants: [{
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'user'
    }]
});

mongoose.model('Chat', chatSchema, 'chats');