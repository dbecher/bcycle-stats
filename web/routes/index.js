var models = require('../../models');

/*
 * GET home page.
 */
 
function groupBy(obj, iterator) {
  var result = {};
  obj.forEach(function(value, index) {
    var key = iterator(value, index);
    (result[key] || (result[key] = [])).push(value);
  });
  return result;
}

exports.index = function(req, res){
  models.Station.find(function(err, stations) {
    res.render('index', { stations: stations });
  });
};

exports.data = function(req, res) {
  models.Availability.find({}).sort('date', 1).exec(function(err, availabilities) {
    if(err || !availabilities) availabilities = [];
    var grouped = groupBy(availabilities, function(a) {
      //console.log(a);
      return Date.UTC(a.date.getFullYear(), a.date.getMonth(), a.date.getUTCDate(), a.date.getHours(), a.date.getMinutes());
    });
    
    res.send({
      data: Object.keys(grouped).map(function(utc) {
        return [ parseInt(utc, 10), grouped[utc].reduce(function(i, station) { return i + station.bikes; }, 0) ];
      })
    });
  });
}