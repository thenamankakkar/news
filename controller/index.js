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
       const data = [];
        const blog_img_data = [];
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
                    console.log("first data",data)
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
/*                MongoClient.connect(uri, { useNewUrlParser: true }, (error, client) => {
                    if (error) {
                        return console.log("Connection failed for some reason");
                    }
                    console.log("Connection established - All well");
                    const db = client.db(databaseName);
                    const movies = db.collection('movies')
                    movies.insertMany({

                        array : data
                    }).then(result => {
                        res.status(200).json({code: 200, message: "Successfully saved"});
                        })
                        .catch(error => console.error(error))
                });*/



                let course = new Course({date: new Date(),array:data});
                course.save().then(result => {
                    res.status(200).json({code: 200, message: "Successfully saved"});
                }).catch(err => {
                    res.status(200).json({code: 500, message: err});
                });
            })
            .catch(error =>{
                console.log(error);
            })
    },
    readSingle: (req, res) => {
        let link = req.params.blog_link;
            axios.get(link)
                .then(response => {
                    const $ = cheerio.load(response.data);
                    let c = $('h1').attr('class')
                    c = c.replace(/ .*/,'');
                    $('article' + "."+c).each((i, elem) => {
                        let data  = {
                            blog_img : result.blog_img,
                            blog_article : $(elem).find('p').text()
                        };
                        console.log(data)

                        res.json(data);
                    })

                });



    },
    readAll: (req, res) => {

            Course.find((err, result) => {
                if (err) assert.deepStrictEqual(null, err);
                res.json(result);
            })
    },
    readDate: (req, res) => {
        let date = req.params.date;
            Course.find({ "date": {
                    "$gt": new Date(date)
                }},(err, result) => {
                if (err) assert.deepStrictEqual(null, err);
                console.log(result)
                res.json(result);
            })
    }
};
