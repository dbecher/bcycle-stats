module.exports = function(mongoose) {
  var Station = new mongoose.Schema({
    "name": String,
    "address": {
      "city": String,
      "state": String,
      "street": String,
      "zip": String
    },
    "location": [Number], 
    "docks": Number,
    "_bcycleId": String,
    "publicText": String,
    "hours": String
  }, {strict: true, index: {"location": "2d"}});
  
  Station.plugin( require('./plugins/timestamps') );
  
  Station.statics.findOrCreate = function(api_station, cb) {
    var self = this;
    this.model('Station').findOne({ _bcycleId: api_station.Id }, function(err, station) {
      if(err) return cb(err);
      var model_json = self.model('Station').fromApiJson(api_station);
      if(station) {
        station.set(model_json).save(function(err) {
          if(err) return cb(err);
          cb(undefined, station);
        });
      }
      else {
        var station = new (self.model('Station'))(model_json).save(function(err, res) {
          if(err) return cb(err);
          cb(undefined, res);
        });
      }
    });
  }
  
  Station.statics.fromApiJson = function(api_json) {
    return {
      name: api_json.Name || "",
      address: {
        city: api_json.Address.City || "",
        state: api_json.Address.State || "",
        street: api_json.Address.Street || "",
        zip: api_json.Address.ZipCode || ""
      },
      location: (api_json.Location && api_json.Location.Longitude) ? [api_json.Location.Longitude, api_json.Location.Latitude] : [],
      docks: api_json.TotalDocks || 0,
      _bcycleId: api_json.Id || "",
      publicText: api_json.PublicText || "",
      hours: api_json.HoursOfOperation || ""
    }
  }
  
  return mongoose.model('Station', Station);
}