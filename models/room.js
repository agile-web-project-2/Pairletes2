var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema(
    {user: String,
     message: String,
     roomName: String,
     time: Date
});

mongoose.model('Room', roomSchema, 'rooms');