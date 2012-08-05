var cronJob = require('cron').CronJob;
var scraper = require('./scrape');

new cronJob('0 */5 * * * *', function(){
  try {
    scraper();
  } catch(err) {
    console.err(err.message);
  }
}, null, true);