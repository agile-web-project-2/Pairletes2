var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    gender: String,
    birthdate: Date,
    gym: {},
    address: [{street: {}, city: {}, state: {}, country: {}}],
    interests: [{interest1: {}, interest2: {}, interest3: {}}],
    aboutMe: {}
}, { minimize: false });

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
