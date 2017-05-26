var should = require('chai').should();

/************************************************************************************
 * For local Mongo Server start server e.g ( sudo mongod --dbpath /var/lib/mongodb/ ) 
 ************************************************************************************/

var mongoose = require('mongoose');
var mlab = require('../mlab-user-pass.js');

// require('../app_api/models/account.js');
// var Account = mongoose.model('Account');
var Account = require('../models/account');
var dummy = require('./dummy-account-data.js');
var db;

require('../controllers/accounts');



describe('Matching Queries: ', function() {
    
   before(function(done){
        db = mongoose.connect('mongodb://localhost:27017/test');
        done();
    });

    beforeEach(function(done) {
        
        // number of dummy accounts total
            console.log('There are %s dummy user accounts, saving them now', dummy.data.length);
            // create all dummy user accounts
                for (var i=0; i < dummy.data.length; i++) {
                    console.log('loop %s', i);
                    Account.register(new Account(dummy.data[i]), 'p@s5w0Rd',
                    function(err, account) {
                        if (err) {
                            console.log('There was an error while registering your username!', err);
                            console.log('account: ' + account);
                            // sendJsonResponse(res, 400, err);
                        } else {
                            console.log('user %s is added!', account.username);
                            // sendJsonResponse(res, 201, account);
                        }
                    });
                };
            console.log("done");
            done();
    });

    it('should find all Male members', function(done) {
        Account.
            find({
                gender: 'Male'
            }).
            limit(10).
            exec(function (err, matchResults) {
                if (err) { 
                    console.log("There is a matching error");
                } else {
                    console.log('matchResults.username ---------------------\n', matchResults);
                    matchResults.length.should.eql(5);
                    done();
                }
            });   
    });


    afterEach(function(done) {
       done();
    });

    after(function(done){// after all the tests have finished
         Account.remove({}, function() {
            mongoose.connection.close();
            done();
        });
    });
});
