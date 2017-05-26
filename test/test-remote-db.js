/*********************
    TEST REMOTE DB
**********************/
var should = require('chai').should();
var mlab = require('../mlab-user-pass.js');

var mongoose = require('mongoose');

var dummySchema = new mongoose.Schema({
    testString: String
});

var Dummy = mongoose.model('Dummy', dummySchema, 'dummy');
var db;


describe('Remote Test Database Connect', function(){
    before(function(done){//before the test begins
        var dbURI = 'mongodb://'+mlab.testUser+':'+mlab.testPass+'@ds129651.mlab.com:29651/test-7975';
        var options = {
            server: { socketOptions: { keepAlive: 5000000, connectTimeoutMS: 500000 } },
            replset: { socketOptions: { keepAlive: 5000000, connectTimeoutMS: 500000 } }
        };
        db = mongoose.connect(dbURI, options);
        done();
    });

    beforeEach(function(done) {
        // create dummy instance
        var dummy_instance = new Dummy({
            testString: 'cavalry'
        });
        // save the new model instance, passing a callback
        dummy_instance.save(function(error) {
            if (error) console.log('(saving to database) error ' + error.message);
            else console.log('          no error - data saved to database');
            done();
        });
    });

    it('should find the remote dummy test string "cavalry"', function(done) {
        Dummy.findOne({ testString: 'cavalry' }, function(err, dummy) {
            dummy.testString.should.eql('cavalry');
            console.log("   testString: ", dummy.testString);
            done(); //Call done to tell mocha that we are done with this test
        });
    });

    afterEach(function(done) {
        // Dummy.remove({}, function() {
            done();
        // });
    });

    after(function(done){// after all the test have finished
        mongoose.connection.close();
        done();
    });
});