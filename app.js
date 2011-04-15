var core   = require('./lib/core'),
    model  = require('./lib/model'),
    socket = require('./lib/socket'),
    crypto = require('crypto'),
    app    = module.exports = core.app;

app.get('/', function(req, res) {
    console.log('session:', req.session);
    if (!req.session.verified) {
        res.render('index');
        return;
    }

    if (req.param('next')) {
        console.log('next');
    }
    else if (req.param('prev')) {
        console.log('prev');
    }

    res.render('controller');
});

app.all('/login', function(req, res) {
    console.log('session:', req.session);
    if (req.session.verified) {
        re.redirect('/');
        return;
    }

    var id       = req.param('id');
    var password = req.param('password');
    if (id && password) {
        password = crypto.createHash('md5').update(password).digest('hex');
        model.User.findOne({ id: id, password: password }, function(err, user) {
            if (!user) {
                res.render('login');
                return;
            }

            req.session.regenerate(function() {
                req.session.verified = true;
                req.session.user     = user.doc;
                res.redirect('/');
                return;
            });
        });
    }
    else {
        res.render('login');
        return;
    }
});

app.get('/logout', function(req, res) {
    console.log('session:', req.session);
    req.session.destroy(function() {
        res.redirect('/');
    });
});

if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
}
