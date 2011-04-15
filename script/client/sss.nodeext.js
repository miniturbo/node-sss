SSS.NodeExtension = SSS.util.class.create({
    init: function(host, port) {
        var that = this;

        this.host = host || document.location.host;
        this.port = port || document.location.port || 80;

        this.pr = new SSS.Presentation();

        $('<div id="nodeext-container"></div>')
            .css({
                margin: '0.1em 0.2em',
                position: 'fixed', top: 0, right: 0, zIndex: 100,
                color: '#888', fontSize: '300%', fontWeight: 'bold',
                opacity: '0.3',
            })
            .insertAfter(this.pr.container);
        this.container = $('#nodeext-container')[0];

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
            that.socket.send({ type: 'notifyPageIndex', value: that.pr.currentIndex });
        });

        this.socket.on('message', function(data) {
            if (!data) return;

            if (data.type === 'remote' && data.detail) {
                that.remote(data.detail, data.value);
            }

            if (data.type === 'notifyClientIndex') {
                that.setClientIndex(data.value);
            }
        });

        SSS.util.event.addListener(window, 'SSSPresentationChangePage', function(event, pr) {
            that.socket.send({ type: 'notifyPageIndex', value: pr.currentIndex });
        });

        // event listener
        this.socket.connect();
    },

    remote: function(detail, value) {
        switch (detail) {
            case 'next':
                this.pr.next();
                break;
            case 'prev':
                this.pr.prev();
                break;
            case 'sync':
                this.pr.go(value);
                break;
        }
    },

    setClientIndex: function(index) {
        this.index = index;
        $(this.container).text(index);
    }
});
SSS.NodeExtension = SSS.util.class.singleton(SSS.NodeExtension);
