var mongoose = require('mongoose');

models = { 
  Station: require('./station')(mongoose), 
  Availability: require('./availability')(mongoose)
};

mongoose.connect('mongodb://localhost/bcycle', function(err) {
  if(err) throw new Error(err.message);
  console.log("Connected to mongodb");
});

module.exports = models;