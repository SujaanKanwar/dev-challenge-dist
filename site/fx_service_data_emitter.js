class DataHandler {
    constructor(Stomp) {
        const url = "ws://localhost:8011/stomp";
        const webSocket = Stomp.client(url);
        webSocket.debug = function (msg) {
            if (global.DEBUG) {
                console.info(msg)
            }
        };
        this.webSocket = webSocket;
        this.webSocket.connect({}, this.init.bind(this), (error)=> alert(error.headers.message));

        this._events = {};
        this.PRICES_DATA_RECEIVED = 'data-receive';
    }

    _emit(event, data) {
        if (this._events[event]) {
            this._events[event].forEach((callback)=> callback(data))
        }
    }

    on(event, callback) {
        if (this._events[event]) {
            this._events[event].push(callback);
        } else {
            this._events[event] = [callback];
        }
    }

    off(event) {
        this._events[event] = [];
    }

    init() {
        this.webSocket.subscribe('/fx/prices', (event)=> {
            this._emit(this.PRICES_DATA_RECEIVED, JSON.parse(event.body));
        })
    }
}


module.exports = DataHandler;