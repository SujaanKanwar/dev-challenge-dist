module.exports = (function () {
    function TableModule(config, DataHandler, HTMLEmulator, Sparkline, Stomp) {
        this._dataHandler = new DataHandler(Stomp);

        this._htmlEmulator = new HTMLEmulator(config.container, Sparkline);

        this.sortByColumn = config.sortByColumn;

        this.init();
    }

    var proto = (function () {
        function _dataReceived(data) {
            this._htmlEmulator.render(data);
        }

        function init() {
            this._dataHandler.on('data-receive', _dataReceived.bind(this))
        }

        return {
            init: init
        }
    })();

    TableModule.prototype = proto;
    TableModule.prototype.constructor = TableModule;

    return TableModule;
})();