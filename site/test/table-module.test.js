const assert = require('assert');
const Stomp = require('./dummy-stomp');
const Sparkline = require('./dummy-sparkline');
const TableModule = require('../table_module');
const DataHandler = require('../data_handler');
const HTMLEmulator = require('../html_emulator');

window.localStorage = (function () {
    var store = {};

    function getItem(key) {
        return store[key];
    }

    function setItem(key, value) {
        store[key] = value;
    }

    return {
        getItem: getItem,
        setItem: setItem
    }
})();

describe("Data Handler test cases", function () {
    const dataHandler = new DataHandler(Stomp);
    it('Check for return types', function () {
        assert.notEqual(undefined, dataHandler['on']);
        assert.notEqual(undefined, dataHandler['off']);
    })
});
describe("HTML emulator", function () {
    const container = document.createElement('div');
    const rows = document.createElement('div');
    rows.classList.add('js_rows');
    container.appendChild(rows);
    const htmlEmulator = new HTMLEmulator(container, Sparkline);
    const dummyData = [
        {
            "name": "usdjpy",
            "bestBid": 110,
            "bestAsk": 114,
            "openBid": 107,
            "openAsk": 109,
            "lastChangeAsk": 3,
            "lastChangeBid": 3
        }];
    it('check for return type', function () {
        assert.notEqual(undefined, htmlEmulator['render']);
    });
    it('render data', function () {
        htmlEmulator.render(dummyData);
        const rows = container.querySelector('.js_rows');
        assert.equal(rows.children.length, 1);
    })
});

describe("Table Module", function () {
    const container = document.createElement('div');
    const rows = document.createElement('div');
    rows.classList.add('js_rows');
    container.appendChild(rows);

    const config = {
        container: container,
        sortByColumn: 'lastChangeBid'
    };
    const tableModule = new TableModule(config, DataHandler, HTMLEmulator, Sparkline, Stomp);

    it('check for return type', function () {
        assert.notEqual(undefined, tableModule['init']);
    });
});