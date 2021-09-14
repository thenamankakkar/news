var CronJob = require('cron').CronJob;
var job = new CronJob('00 02 21 * * *', function() {
    console.log('You will see this message every second');
}, null, true, 'Asia/Kolkata');
job.start();

