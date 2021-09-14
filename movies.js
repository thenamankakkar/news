const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.news18.com/movies/";

axios.get(url)
    .then(response => {
        data = [];
        blog_img_data = [];
        blog_link=[];
        blog_link_info=[];
        const $ = cheerio.load(response.data);
        //console.log($('ul .jsx-3278050665 h3.jsx-3278050665').text()+"\n")

/*        $('.jsx-3278050665 .top_story_right li .jsx-3278050665').each((i,elem)=>{
            //console.log($(elem).find("\n"+'h3.jsx-3278050665').text()+"\n")
            console.log($(elem).find('a .jsx-3278050665').html())
        })*/

/*888888888888888888888888Adding blog images and data to array888888888888888888888888888*/
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

        data.forEach((element ,index,array)=>{
            element.blog_img = blog_img_data[index].blog_img
            element.blog_link = blog_link[index].blog_link
        })



        var self = this
        data.forEach((element, index, array) => {
            axios.get(element.blog_link)
                .then(response => {
                    const $ = cheerio.load(response.data);
                    $('article .jsx-4148784527').each((i, elem) => {
                        console.log(index)
                    })
                });
        })


        //console.log(data)


        /*888888888888888888888888Adding blog images and data to array888888888888888888888888888*/
    })
    .catch(error =>{
        console.log(error);
    })


