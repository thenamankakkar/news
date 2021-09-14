const config = require('../config.json');

module.exports = {
    dev: process.env.MONGO_URI || require('../config.json').mongo_uri,
    prod: process.env.MONGO_URI || require('../config.json').mongo_uri,
};
