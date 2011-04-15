var express = require('express'),
    app     = express.createServer(),
    config  = { cookieSecret: 'sss' },
    store   = new (require('connect').session.MemoryStore)();

app.configure(function() {
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        store: store,
        secret: config.cookieSecret,
        cookie: { httpOnly: false },
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/../public'));
    app.dynamicHelpers({
        session: function(req, res) { return req.session }
    });
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

exports.app   = app;
exports.store = store;
