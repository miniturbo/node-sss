var mongoose = require('mongoose'),
    crypto   = require('crypto'),
    Schema   = mongoose.Schema;

// User Schema
var User = new Schema({
    id: String,
    password: String,
    date: Date,
});
User.pre('save', function(next) {
    this.password = crypto.createHash('md5').update(this.password).digest('hex');
    this.date     = new Date();
    next();
});

mongoose.model('User', User);
mongoose.connect('mongodb://localhost/node-sss');

exports.User = mongoose.model('User');
