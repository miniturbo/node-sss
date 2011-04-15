$(function() {
    var socket = new io.Socket();
    socket.on('connect', function() {
        socket.send({ cookie: document.cookie });
    });

    $('#next .button').click(function() {
        socket.send({ type: 'remote', detail: 'next' });
        return false;
    });

    $('#prev .button').click(function() {
        socket.send({ type: 'remote', detail: 'prev' });
        return false;
    });

    $('#sync .button').click(function() {
        socket.send({ type: 'remote', detail: 'sync', value: $('#sync > input').val() });
        return false;
    });

    socket.connect();
});
