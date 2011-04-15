$(function() {
    var socket = new io.Socket();
    socket.on('connect', function() {
        socket.send({ cookie: document.cookie });
    });

    $('#next').click(function() {
        socket.send({ method: 'next' });
        return false;
    });

    $('#prev').click(function() {
        socket.send({ method: 'prev' });
        return false;
    });

    socket.connect();
});
