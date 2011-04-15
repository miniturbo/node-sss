var model = require(__dirname + '/../lib/model.js');

var args = process.argv.slice(2);
if (!args[0] || !args[1]) {
    console.log('Usage: node register.js {id} {password}');
    return;
}

var user = new model.User();
user.id       = args[0];
user.password = args[1];

user.save(function(err) {
    if (!err) console.log('saved!');
});
