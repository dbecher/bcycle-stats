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
  var station = req.query.station,
      from = (req.query.from) ? parseInt(req.query.from, 10) : new Date().setFullYear(new Date().getFullYear() - 1),
      to = (req.query.to) ? req.query.to : new Date().getTime();
  
  var query = models.Availability.find({});
  if(station) query.where('station', station);
  query.where('date').gte(from).lte(new Date(to));
  query.sort('date', 1).exec(function(err, availabilities) {
    if(err) return res.json(500, { error: err.message });
    if(!availabilities) availabilities = [];
    var grouped = groupBy(availabilities, function(a) {
      return Date.UTC(a.date.getUTCFullYear(), a.date.getUTCMonth(), a.date.getUTCDate(), a.date.getUTCHours(), a.date.getUTCMinutes());
    });
    console.log(availabilities.length);
    
    res.type('json');
    res.send(JSON.stringify({
      data: Object.keys(grouped).map(function(utc) {
        return [ parseInt(utc, 10), grouped[utc].reduce(function(i, station) { return i + station.bikes; }, 0) ];
      }),
      date: to
    }));
  });
}