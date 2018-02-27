module.exports = (function () {
    function DataHandler(Stomp) {
        const url = "ws://localhost:8011/stomp";
        const webSocket = Stomp.client(url);
        webSocket.debug = function (msg) {
            if (global.DEBUG) {
                console.info(msg)
            }
        };
        this.webSocket = webSocket;
        this.webSocket.connect({}, this.init.bind(this), function (error) {
            alert(error.headers.message)
        })
    }

    var proto = (function () {
        var events = {};
        var PRICES_DATA_RECEIVED = 'data-receive';
        var data = {};

        function _emit(event, data) {
            if (events[event]) {
                events[event].forEach(function (callback) {
                    callback(data);
                })
            }
        }

        function on(event, callback) {
            if (events[event]) {
                events[event].push(callback);
            } else {
                events[event] = [callback];
            }
        }

        function off(event) {
            events[event] = [];
        }

        function init() {
            this.webSocket.subscribe('/fx/prices', function (event) {
                _emit(PRICES_DATA_RECEIVED, JSON.parse(event.body));
            })
        }

        return {
            on: on,
            off: off,
            init: init
        }
    })();
    DataHandler.prototype = proto;
    DataHandler.prototype.constructor = DataHandler;
    return DataHandler
})();