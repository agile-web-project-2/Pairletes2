var mongoose = require('mongoose');

var msgSchema = new mongoose.Schema(
      {user: String,
        message: String,
        time: Date
      });

mongoose.model('Message', msgSchema, 'messages');      
