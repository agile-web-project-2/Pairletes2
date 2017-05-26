var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    name: String,
    email: String,
    //password: String,
    gender: String,
    birthdate: {
        type: Date,
        required: true,
        min: new Date('1910-01-01'),
        max: Date.now 
    },
    gym: String,
    address: {street: String, city: String, state: String, country: String},
    interests: {interest1: String, interest2: String, interest3: String},
    aboutMe: String
}, { minimize: false });

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
