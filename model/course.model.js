const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Course = new Schema([{
    blog_title: {type: String},
    blog_img: {type: String},
    blog_link: {type: String},
    date : {type : Date},
    array : {type : Array}
}], {
    "collection": "movies"
});


module.exports = mongoose.model("movies", Course);
