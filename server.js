const express = require('express');
const assert = require('assert');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config.json').mongo_uri;
const PORT = Number(process.env.PORT || require('./config.json').port);
const courseRoute = require('./route');


/*imports for cron job onlie*/
const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.news18.com/movies/";
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://namankakkar:namankakkar@cluster0.8wxvy.gcp.mongodb.net/news?authSource=admin&ssl=true";
const databaseName = "news";
/*imports for cron job onlie*/


const app = express();

//body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// db connection
mongoose.Promise = global.Promise;
mongoose
    .connect(config, {useNewUrlParser: true})
    .then((res) => {
        console.log("Database connected");
    })
    .catch((err) => assert.equal(err, null));
app.use(cors());

app.use('/', courseRoute);

/*cron job*/
var CronJob = require('cron').CronJob;
var job = new CronJob('00 00 07 * * *', function() {
    axios.post('http://localhost:4600/course')
        .then(res => {
            console.log("data hitted")
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
}, null, true, 'Asia/Kolkata');
job.start();
const https = require('https');

app.listen(PORT, () => {
    console.log(`server is running in http://localhost:${PORT}`);
});
