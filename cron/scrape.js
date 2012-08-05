var models = require('../models'),
    request = require('superagent'),
    async = require('async');

module.exports = function() {
  async.parallel([
//     function getFromDb(cb) {
//       models.Station.find({}, function(err, res) {
//         if(err) return cb(err);
//         cb(null, res);
//       });
//     },
    function callAPI(cb) {
      request
        .get('http://api.bcycle.com/services/mobile.svc/ListKiosks')
        .type('json')
        .end(function(res) {
          if(res.ok) {
            var all = res.body.d.list;
            cb(null, all.filter(function(station) {
              return station.Address.City === 'Charlotte';
            }));
          }
          else cb(new Error(res.text));
        });
    }
  ], function updateDB(err, results) {
    if(err) return console.log(err);
    var api_stations = results[0];
    var date = new Date();
    console.log(date.toString());
    async.forEach(api_stations, function(station, cb) {
      models.Station.findOrCreate(station, function(err, model) {
        models.Availability.fromApi(station, model, date, function(err, res) {
          cb(err);
        });
      });
    },
    function doneWithUpdates(err) {
      if(err) return console.log(err.text);
      console.log("Done updating stations");
    });
  });
}