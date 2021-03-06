var mongoose = require('mongoose');

var msgSchema = new mongoose.Schema({
	chatId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	reciever: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	}
    },{
    timestamps: true
});

mongoose.model('Message', msgSchema, 'messages');
