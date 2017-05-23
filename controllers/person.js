require('../models/db');
var mongoose = require('mongoose');
var Person = mongoose.model('Person');

/*SimpleList page*/
module.exports.personList = index;
  function index(req,res){
    Person.find().exec(
          function(err, simpleData){
            if(err){res.render('error', {
              message:err.message,
              error: err});
            }
  	  else{console.log('find complete');
  	    res.render('person',{'people':simpleData,'user':req.user});}
  	}
  );                                           
};


/*add person*/
module.exports.newPerson = function(req,res){
  var newPerson = new Person({name: req.body.name, age: req.body.age, email: req.body.email});
  newPerson.save(function(err, data){
    if(err){
      console.log(err);
      res.status(500);
      res.render('error', {
        message:err.message,
        error: err
      });
    }
    else{
      console.log(data, ' saved');
      index(req, res);
    }
  });
};


/*Delete person*/
module.exports.deletePerson = function(req,res){
  Person.remove({_id:req.params.id}, function(err){
    if(err){
      console.log(err);
      res.status(500);
      res.render('error', {
        message:err.message,
        error: err
      });
    }
    else{
      console.log(req.params.id, ' removed');
      index(req, res);
    }
  });
}

module.exports.age = function(DOB){
  today = new Date();
  age = today.getFullYear()-DOB.getFullYear();
  if(today.getMonth()<DOB.getMonth())
    return age-1;
  else if(today.getMonth() === DOB.getMonth() && today.getDate()<DOB.getDate())
    return age-1;
  return age;
}
