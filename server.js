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
var job = new CronJob('00 05 07 * * *', function() {
    data = [];
    blog_img_data = [];
    blog_link=[];
    blog_link_info=[];

    axios.get(url)
        .then(response => {
            const $ = cheerio.load(response.data);
            let c = $('figure').attr('class')
            $("."+c+ ".blog_title").each((i, elem) => {
                data.push({
                    blog_title: $(elem).find('h4').text(),
                })
            })

            $("."+c+ ".blog_img").each((i, elem) => {
                blog_img_data.push({
                    blog_img: $(elem).find('img').attr('data-src')
                })
            })
            $("."+c+ ".blog_list_row").each((i, elem) => {
                blog_link.push({
                    blog_link: $(elem).find('a').attr('href')
                })
            })

            var datetime = new Date();
            data.forEach((element ,index,array)=>{
                element.blog_img = blog_img_data[index].blog_img
                element.blog_link = blog_link[index].blog_link
                element.date = datetime.toISOString().slice(0,10)
            })
            /*saving data array to DB here*/
            MongoClient.connect(uri, { useNewUrlParser: true }, (error, client) => {
                if (error) {
                    return console.log("Connection failed for some reason");
                }
                console.log("Connection established - All well");
                const db = client.db(databaseName);
                const movies = db.collection('movies')
                movies.insertMany(data).then(result => {
                    res.status(200).json({code: 200, message: "Successfully saved"});
                })
                    .catch(error => console.error(error))
            });

        })
        .catch(error =>{
            console.log(error);
        })
    console.log('cron job is running');
}, null, true, 'Asia/Kolkata');
job.start();

app.listen(PORT, () => {
    console.log(`server is running in http://localhost:${PORT}`);
});
