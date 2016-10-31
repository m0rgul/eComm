var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function () {
    mongoose.Promise = global.Promise;
    var db = mongoose.connect(config.db, function (err) {
        if (err) {
            var date = new Date();
            console.log('DB error at: ' + date);
            console.log(err);
        }
    });

    require('../app/models/category.server.model');
    require('../app/models/products.server.model');
    return db;
};