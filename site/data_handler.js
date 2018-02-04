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
        var LOCAL_PRICE_STORAGE = 'local_price_storage';
        var localStorage = window.localStorage;
        var data = {};

        function _emit(event, data) {
            if (events[event]) {
                events[event].forEach(function (callback) {
                    callback(data);
                })
            }
        }

        function _throttle(func, timeout) {
            var timeoutId = null;
            return function () {
                if (!timeoutId) {
                    func.apply(this, arguments);
                    timeoutId = setTimeout(function () {
                        clearTimeout(timeoutId);
                    }, timeout);
                }
            }
        }

        function _dataToLocalStorage(data) {
            localStorage.setItem(LOCAL_PRICE_STORAGE, JSON.stringify(data));
        }

        function _saveData(priceData) {
            data[priceData.name] = priceData;
            var throttledSaveData = _throttle(_dataToLocalStorage, 5000);
            throttledSaveData(data);
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
            data = JSON.parse(localStorage.getItem(LOCAL_PRICE_STORAGE)) || {};

            this.webSocket.subscribe('/fx/prices', function (event) {

                _saveData(JSON.parse(event.body));

                _emit(PRICES_DATA_RECEIVED, data);
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