var mongoose = require('mongoose');

var simpleSchema = new mongoose.Schema(
    {name: String,
      age: Number,
      email: String
    }
  );

mongoose.model('Person', simpleSchema, 'people');

