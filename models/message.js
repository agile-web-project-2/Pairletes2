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
	body: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
    },{
    timestamps: true
});

mongoose.model('Message', msgSchema, 'messages');
