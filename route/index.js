const express = require('express');
const cRoute = express.Router();
const courseController = require('../controller');

//create
cRoute.route('/course').post(courseController.create);


module.exports = cRoute;
