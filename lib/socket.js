var core   = require('./core'),
    socket = require('socket.io').listen(core.app);

var pageIndex = {}, syncIndex, cnt = 0;
socket.on('connection', function(client) {
    var index = ++cnt;
    client.send({ type: 'notifyClientIndex', value: index });

    console.log('sync index:', syncIndex);
    console.log('page index:', pageIndex);
    if (syncIndex && pageIndex[syncIndex]) {
        client.send({ type: 'remote', detail: 'sync', value: pageIndex[syncIndex] });
    }

    client.on('message', function(data) {
        console.log('received data:', data);
        console.log('client index:', index);

        // SSSでページが変更されたときの処理
        if (data.type === 'notifyPageIndex') {
            pageIndex[index] = data.value;
            console.log('page index:', pageIndex);
        }

        var cookie = data.cookie || client.request.headers.cookie;
        if (!cookie) return;

        var sid = require('connect').utils.parseCookie(cookie)['connect.sid'];
        if (!sid) return;

        // コントローラ側の処理
        core.store.get(sid, function(err, session) {
            // 認証済みのユーザ
            if (session && session.verified) {
                if (data.type === 'remote' && data.detail) {
                    // 送られてきたsync対象のclient indexを設定する
                    if (data.detail === 'sync') {
                        syncIndex = data.value;
                    }
                    // clientにブロードキャストする
                    else {
                        client.broadcast({ type: 'remote', detail: data.detail, value: data.value });
                    }
                }
            }
        });
    });

    client.on('disconnect', function(client) {
        delete pageIndex[index];
        if (syncIndex === index) {
            syncIndex = undefined;
        }
    });
});

exports.instance = socket;
