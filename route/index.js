const express = require('express');
const cRoute = express.Router();
const courseController = require('../controller');

//create
cRoute.route('/course').post(courseController.create);
cRoute.route('/course').get(courseController.readAll);
cRoute.route('/course/:date').post(courseController.readDate);
cRoute.route('/course/blog_link').post(courseController.readSingle);


module.exports = cRoute;
