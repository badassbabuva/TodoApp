var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:piyu123@ds245680.mlab.com:45680/todoapp');

module.exports = {mongoose};