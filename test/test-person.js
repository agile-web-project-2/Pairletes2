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
