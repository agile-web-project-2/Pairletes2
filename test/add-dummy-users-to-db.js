var should = require('chai').should();

var mongoose = require('mongoose');
var mlab = require('../mlab-user-pass.js');

// require('../app_api/models/account.js');
// var Account = mongoose.model('Account');
var Account = require('../models/account');
var dbUser = require('./dummy-account-data.js');
var db;

console.log(dbUser.data)

describe('Account: Adds new account to the database; ', function() {
    
    before(function(done){
        var dbURI = 'mongodb://'+mlab.testUser+':'+mlab.testPass+'@ds129651.mlab.com:29651/test-7975';
        var options = {
            server: { socketOptions: { keepAlive: 5000000, connectTimeoutMS: 500000 } },
            replset: { socketOptions: { keepAlive: 5000000, connectTimeoutMS: 500000 } }
        };
        db = mongoose.connect(dbURI, options);

        // create account instance
        for(var i=0; i<dbUser.data.length; i++) {
            Account.register(new Account(dbUser.data[i]), 'a',
            function(err, account) {
                if (err) {
                    console.log('There was an error while registering your username!', err);
                    console.log('account: ' + account);
                    // sendJsonResponse(res, 400, err);
                } else {
                    console.log('Your username is registered!');
                    // sendJsonResponse(res, 201, account);
                }
            });
            
        }
        done(); 
    });

    it('should store to online mongo database', function(done){
        done();        
    });

    beforeEach(function(done) {
        done();
    });


    afterEach(function(done) {
        Account.remove({}, function() {
            done();
        });
    });

    after(function(done){// after all the tests have finished
        mongoose.connection.close();
        done();
    });
});