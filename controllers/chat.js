require('../models/db');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var Chat = mongoose.model('Chat');
var Room = mongoose.model('Room');
var Account = mongoose.model('Account');


//Private Chat controllers
module.exports.newMessage = function(req, res, next){
	console.log('New message recieved from ' + req.user.username);
	console.log('Sending to ' + req.recip._id);

    if(!req.params.recipId){
    	res.status(422).send({ error: 'Please choose a valid recipient for your message.'});
    	return next();
    }

    if(!req.body.composedMessage){
    	res.status(422).send({ error: 'Please enter a message.'});
    }

	var chat = new Chat({
		chatParticipants: [req.user._id, req.recip._id]
	});

	console.log('new chat created with ' + req.params.recipId);

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
			    author: req.user._id,
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

    Account.
      find({recip: req.params.recipId}).
      limit(1).
      exec(function (err, recip) {
      if (err) { 
        console.log(err);
        res.render('error.jade', { message: "There is no recipient" });
      } else {
        console.log('sending new message to', recip.username);
        res.render('newMessage', {
          user: req.user,
          recip: recip
        });
      }
    });   
};

module.exports.getChats = function(req, res, next){
    console.log('Finding Chats');
    Chat.find({participants: req.user._id})
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
                console.log('creating chat list')
                var fullChats = [];
                chats.forEach(function(chat){
                	console.log('new Chat found')
                	Message.find({ 'chatId' : chat._id})
                	    .sort('-createdAt')
                	    .limit(1)
                	    .populate({
                	    	path: "author",
                	    	select: "profile.firstName profile.lastName"
                	    })
                	    .exec(function(err, message){
                	    	if(err){
                	    		console.log(err);
                	    		res.status(500);
                                res.render('error', {
                                  message: "Whooops, this user doesn't seem to be on Pairletes"
                                });
                	    	}
                	    	else{
                	    		fullChats.push(message);
                	    		if(fullChats.length == 0){
                	    			console.log('no chats!');
                	    			res.render('error', {
                	    				message: "It would appear you have no chats"
                	    			})
                	    		}
                	    		if(fullChats.length === chats.length){
                	    			console.log('Sending chat list')
                	    			
                	    		}
                	    	}
                	    });
                });
        	}
        });
}

module.exports.enterChat = function(req, res, next){
    console.log('User Connected');
    Message.find({ chatId : req.params.chatId})
      .select('createdAt body author')
      .sort('createdAt')
      .populate({
      	path: 'author',
      	select: 'profile.firstName profile.lastName'
      })
      .exec(function(err, messages){
            if(err){
            	console.log(err);
                res.status(500);
                res.render('error', {
                    message: "Whooops, this user doesn't seem to be on Pairletes"
                });
            }
            else{
            	res.status(200).json({ chat: messages });
            }
        });
}

module.exports.sendReply = function(res, req, next){
	console.log('Sending Message');
	var reply = new Message({
		chatId: req.params.chatId,
		body: req.body.composedMessage,
		author: req.user._id
	});

	reply.save(function(err, sentReply){
		if(err){
			console.log(err);
            res.status(500);
            res.render('error', {
                message: "Whooops, this user doesn't seem to be on Pairletes"
            });
		}
		else{
			res.status(200).json({message: 'Reply successfully sent!'});
			return(next);
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