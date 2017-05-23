var assert = require('assert');
var mongoose = require('mongoose');
var db;
var PersonCtrl = require('../controllers/person.js');
require('../models/person.js');
var Person = mongoose.model('Person');

var DOB1, DOB2;

describe('Person',function(){
  describe('Person-Basic', function(){//group test cases together
  
    before(function(){//before the tests begin
      DOB1 = new Date(2001, 12, 24);
      DOB2 = new Date(2001, 1, 24);
    });
  
    after(function(){//afert all tests are completed
      mongoose.connection.close();
    });
  
    beforeEach(function(){//run before each test
      //nothing to setup
    });
  
    //run tests
    it('tests age for late birthday', function(){
      assert.equal(PersonCtrl.age(DOB1), 14, 'Age should be 14');
      });
  
    it('tests age for early birthday', function(){
      assert.equal(PersonCtrl.age(DOB2), 15, 'Age should be 15');
      });
    
    afterEach(function(){//run after each test
      //nothing to cleanup
    });
  });

  describe('Person-Data', function(){
    before(function(done){
      db = mongoose.connect('mongodb://localhost/test');
      done();
    });

    after(function(done){
      mongoose.connection.close();
      done();
    });

    beforeEach(function(done){
      var person = new Person({name:'Tim', email:'tim@mail', age:37});
      person.save(function(error){
        if (error) console.log('error');
	else console.log('data created');
	done();
      });
    });

    it('should return a person', function(done){
      Person.findOne({name:'Tim'}, function(err, data){
        assert.deepEqual([data.name,data.email,data.age], ['Tim','tim@mail',37], 'returns Tim, tim@mail, 37');
	done();
      });
    });

   afterEach(function(done) {
     Person.remove({},function(){
       done();
     });
   });
 });
}); 

/*********************
    TEST REMOTE DB
**********************/

var mongoose = require('mongoose');
var dummySchema = new mongoose.Schema({
    testString: String
});
var Dummy = mongoose.model('Dummy', dummySchema, 'dummy');


describe('Remote Test Database Connect', function(){
    before(function(done){//before the test begins
        var dbURI = 'mongodb://'+mlab.testUser+':'+mlab.testPass+'@ds129651.mlab.com:29651/test-7975';
        var options = {
            server: { socketOptions: { keepAlive: 500000, connectTimeoutMS: 50000 } },
            replset: { socketOptions: { keepAlive: 500000, connectTimeoutMS: 50000 } }
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
        Dummy.remove({}, function() {
            done();
        });
    });

    after(function(done){// after all the test have finished
        mongoose.connection.close();
        done();
    });
});