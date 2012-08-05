module.exports = function(mongoose) {
  var Availability = new mongoose.Schema({
    "station": { type: mongoose.Schema.ObjectId, ref: 'Station' },
    "bikes": Number,
    "docks": Number,
    "available": Boolean,
    "date": Date
  }, {strict: true});
  
  Availability.statics.fromApi = function(api_json, station, date, cb) {
    new (this.model('Availability'))({
      station: station,
      bikes: api_json.BikesAvailable,
      docks: api_json.DocksAvailable,
      available: (api_json.Status === 'Active'),
      date: date
    }).save(cb);
  }
  
  return mongoose.model('Availability', Availability);
}