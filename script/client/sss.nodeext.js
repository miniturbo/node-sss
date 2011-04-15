SSS.NodeExtension = SSS.util.class.create({
    init: function(host, port) {
        var that = this;

        this.host = host || document.location.host;
        this.port = port || document.location.port || 80;

        this.pr = new SSS.Presentation();

        var socketIoUrl = this._buildSocketIoUrl();
        $.getScript(socketIoUrl, function() {
            that._prepareSocket();
        });
    },

    _buildSocketIoUrl: function(host, port) {
        host = host || this.host;
        port = port || this.port;
        return 'http://' + host + ':' + port + '/socket.io/socket.io.js';
    },

    _prepareSocket: function() {
        var that = this;
        this.socket = new io.Socket(this.host, { port: this.port });
        this.socket.on('connect', function() {
            that.socket.send({ cookie: document.cookie });
        });
        this.socket.on('message', function(data) {
            if (!data || !data.method) return;

            that.run(data);
        });
        this.socket.connect();
    },

    run: function(data) {
        switch (data.type) {
            case 'next':
                this.pr.next();
                break;
            case 'prev':
                this.pr.prev();
                break;
        }
    }
});
SSS.NodeExtension = SSS.util.class.singleton(SSS.NodeExtension);
