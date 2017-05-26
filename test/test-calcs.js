var should = require("should");
var dummy = require("./dummy-account-data.js");

describe('Calcs', function() {

  before(function(done) {
   done();
  });



  beforeEach(function(done) {
      done();
    });
  });

  it('Years from 2000', function(done) {
    var today = new Date();
    var y2k = new Date(2000, 1, 1);
    var diff_ms = Math.floor((today - y2k)/31540000000);     

    diff_ms.should.eql(17);
    done();
  });

  it('Should create an activity match strength based on number of matching interests', function(done) {
    var activityIndex;
    var me = dummy.data[0].interests[0] ;
    var other = dummy.data[3].interests[0];

    function getActivityMatch(me, other) {
      /*
      * The input structure should follow the format = { interest1: '', interest2: '', interest3: '' } 
      * The output is the number of matching interests from 'me' to 'other'
      */
      myInterestStr = me.interest1+' '+me.interest2+' '+me.interest3;
      otherInterestStr = other.interest1+' '+other.interest2+' '+other.interest3;
      var searchStr = new RegExp(otherInterestStr.replace(/\s/g, '|'), 'g'); // create RegEx search string
      var res = myInterestStr.match(searchStr); // find matching strings
      return res.length;
    };

    console.log('me: ',  me);
    console.log('other: ',  other);
    // console.log("   my interest:   %s \nother interest:   %s", myInterestStr, otherInterestStr);

    activityIndex = getActivityMatch(me, other)


    activityIndex.should.eql(2);
    done();
  });

  afterEach(function(done) {
      done();
  });

  after(function(done) {
    done();
  });


