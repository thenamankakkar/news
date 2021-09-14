const assert = require('assert');
const Course = require('../model').course;

const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.news18.com/movies/";
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://namankakkar:namankakkar@cluster0.8wxvy.gcp.mongodb.net/news?authSource=admin&ssl=true";
const databaseName = "news";




module.exports = {
    create: (req, res) => {
        // add new content to db
        data = [];
        blog_img_data = [];
        blog_link=[];
        blog_link_info=[];

        axios.get(url)
            .then(response => {
                const $ = cheerio.load(response.data);
                $('.jsx-3278050665 .blog_title').each((i, elem) => {
                    data.push({
                        blog_title: $(elem).find('h4').text(),
                    })
                })

                $('.jsx-3278050665 .blog_img').each((i, elem) => {
                    blog_img_data.push({
                        blog_img: $(elem).find('img').attr('data-src')
                    })
                })
                $('.jsx-3278050665 .blog_list_row').each((i, elem) => {
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



               /* let course = new Course(data);
                course.save().then(result => {
                    res.status(200).json({code: 200, message: "Successfully saved"});
                }).catch(err => {
                    res.status(200).json({code: 500, message: err});
                });*/
            })
            .catch(error =>{
                console.log(error);
            })





    }
};
