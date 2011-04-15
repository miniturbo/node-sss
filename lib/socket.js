var core   = require('./core');
var socket = require('socket.io').listen(core.app);

socket.on('connection', function(client) {
    client.on('message', function(data) {
        var cookie = data.cookie || client.request.headers.cookie;
        if (!cookie) return;

        var sid = require('connect').utils.parseCookie(cookie)['connect.sid'];
        core.store.get(sid, function(err, session) {
            if (!session || !session.verified) return;

            if (data.type) {
                client.broadcast({ type: data.type, value: data.value || null });
            }
        });
    });
});

exports.instance = socket;
