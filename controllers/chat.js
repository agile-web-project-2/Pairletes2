require('../models/db');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var Chat = mongoose.model('Chat');
var Room = mongoose.model('Room');
var Account = mongoose.model('Account');


//Private Chat controllers
module.exports.newMessage = function(req, res, next){
	console.log('New message recieved from ' + req.user.username);
	console.log('Sending to ' + req.params.recipName);

    if(!req.params.recipId){
    	res.status(422).send({ error: 'Please choose a valid recipient for your message.'});
    	return next();
    }

    if(!req.body.composedMessage){
    	res.status(422).send({ error: 'Please enter a message.'});
    }

	var chat = new Chat({
		chatParticipants: [req.user._id, req.params.recipId]
	});

    chat.save(function(err, newChat){
        if(err){
		    console.log(err);
            res.status(500);
            res.render('error', {
                message: "Whooops, this user doesn't seem to be on Pairletes"
            });
        }
        else{
		    var message = new Message({
			    chatId: newChat._id,
			    author: req.user.username,
			    reciever: req.params.recipName,
			    body: req.body.composedMessage
		    });

		    message.save(function(err, data){
	        if(err){
				console.log(err);
                res.status(500);
                res.render('error', {
                    message: "Whooops, this user doesn't seem to be on Pairletes"
                });
			}
			else{
				console.log(data, 'message saved');
			}
		  });
		}
	});
}

module.exports.createNewMessage = function(req,res){
	console.log('creating new private chat with ' + req.params.recipId)

    Account
      .find({username: req.params.recipId})
      .limit(1)
      .exec(function (err, recip) {
      if (err) { 
        console.log(err);
        res.render('error.jade', { message: "There is no recipient" });
      } else {
        console.log('send a new message to', recip[0].username);
        res.render('newMessage', {
          user: req.user,
          recip: recip
        });
      }
    });   
};

module.exports.getChats = function(req, res, next){
    console.log('Finding Chats');
    Chat.find({chatParticipants: req.user._id})
        .select('_id')
        .exec(function(err, chats){
        	if(err){
        		console.log(err);
				res.status(500);
                res.render('error', {
                    message: "Whooops, this user doesn't seem to be on Pairletes"
                });
        	}
        	else{
                var fullChats = [];
                chats.forEach(function(chat){
                	console.log('new Chat found ' + chat)
                	Message.find({ 'chatId' : chat._id})
                	    .sort('-createdAt')
                	    .limit(1)
                	    .exec(function(err, message){
                	    	if(err){
                	    		console.log(err);
                	    		res.status(500);
                                res.render('error', {
                                  message: "Whooops, this user doesn't seem to be on Pairletes"
                                });
                	    	}
                	    	else{
                	    		console.log(message);
                	    		fullChats.push(message);
                	    	}
                	    		if(fullChats.length == 0){
                	    			console.log('no chats!');
                	    			res.render('error', {
                	    				message: "It would appear you have no chats"
                	    			});
                	    		}
                	    		if(fullChats.length === chats.length){
                	    			console.log('Sending chat list');
                	    			console.log(fullChats);
                	    			res.render('messages', {
                	    				fullChats: fullChats
                	    			});
                	    		}
                	    });
                });
        	}
        });
}

module.exports.enterChat = function(req, res, next){
    console.log('User Connected');
    console.log('getting chat', req.params.chatId)
    Message.find({ 'chatId' : req.params.chatId})
      .sort('-createdAt')
      .exec(function(err, messages){
            if(err){
            	console.log(err);
                res.status(500);
                res.render('error', {
                    message: "Whooops, this user doesn't seem to be on Pairletes"
                });
            }
            else{
            	console.log(messages)
            	res.render('chat',{
            		messages: messages
            	})
            }
        });
}

module.exports.sendReply = function(req, res, next){
	console.log('Sending Message to ' + req.params.recipName);
	var reply = new Message({
		chatId: req.params.chatId,
		body: req.body.composedMessage,
		author: req.user.username,
		reciever: req.params.recipName
	});

	reply.save(function(err, data){
		if(err){
			console.log(err);
			res.status(500);
			res.render('error', {
				message: err.message,
				error: err
			});
		}
		else{
			console.log(data, 'message saved');
			res.redirect('/profile/'+req.user.username);
		}
	});
}


//Chat room controllers
module.exports.connect = function(socket, name){
	console.log('User Connected');
	console.log(name)
	Room.find({roomName: name})
	  .sort({times:-1})
	  .limit(10)
	  .exec(function(err, messages){
	  	if(err){
	  		res.render('error',{
	  			message: err.message,
	  			error: err
	  		});
	  	}
	  	else{
	  		console.log('last 10 messages');
	  		for(var i = messages.length-1; i>0; i--){
	  			console.log(messages[i].user, messages[i].message);
	  			socket.emit('message', messages[i].user, messages[i].message);
	  		}
	  	}
	  });
}

module.exports.disconnect = function(){
	console.log('User Disconnected');
}

module.exports.message = function(msg, chatId, userId){
	console.log('message recieved!');
	var chatMessage = new Room({
		user: userId,
		roomName: chatId,
		message: msg,
		time: new Date()
	});
	chatMessage.save(function(err, data){
		if(err){
			console.log(err);
			res.status(500);
			res.render('error', {
				message: err.message,
				error: err
			});
		}
		else{
			console.log(data, 'message saved');
		}
	});
}