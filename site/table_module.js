module.exports = (function () {
    function TableModule(config, DataHandler, HTMLEmulator, Sparkline, Stomp) {
        this._dataHandler = new DataHandler(Stomp);

        this._htmlEmulator = new HTMLEmulator(config.container, Sparkline);

        this.sortByColumn = config.sortByColumn;

        this.init();
    }

    var proto = (function () {
        function _parseData(data) {
            var result = [];
            for (var key in data) {
                result.push(data[key])
            }
            return result;
        }

        function _dataReceived(data) {
            var parsedData = _parseData(data);
            var sortedData = _desSortDataByKey(this.sortByColumn, parsedData);
            this._htmlEmulator.render(sortedData);
        }

        function _desSortDataByKey(key, dataList) {
            dataList.sort(function (a, b) {
                return b[key] - a[key];
            });
            return dataList;
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