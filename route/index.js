const express = require('express');
const cRoute = express.Router();
const courseController = require('../controller');

//create
cRoute.route('/course').post(courseController.create);
cRoute.route('/course/:id').post(courseController.readSingle);


module.exports = cRoute;
