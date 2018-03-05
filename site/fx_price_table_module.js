class TableModule {
    constructor(config, DataHandler, HTMLEmulator, Sparkline, Stomp) {
        this._dataHandler = new DataHandler(Stomp);

        this._htmlEmulator = new HTMLEmulator(config.container, Sparkline);

        this.sortByColumn = config.sortByColumn;

        this.init();
    }

    _dataReceived(data) {
        this._htmlEmulator.render(data);
    }

    init() {
        this._dataHandler.on('data-receive', this._dataReceived.bind(this))
    }
}
module.exports = TableModule;
