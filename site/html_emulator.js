module.exports = (function () {
    function HTMLEmulator(container, Sparkline) {
        this.rowsContainer = container.querySelector('.js_rows');
        this.Sparkline = Sparkline;
    }

    var last30SecondStore = (function () {
        var store = {};

        function set(key, value) {
            if (store[key]) {
                if (store[key].length >= 30) {
                    store[key].shift();
                }
                store[key].push(value);
            } else {
                store[key] = [value];
            }
        }

        function get(key) {
            return store[key];
        }

        return {
            get: get,
            set: set
        }
    })();

    var proto = (function () {
        //i/p = {"name":"euraud","bestBid":1,"bestAsk":1,"openBid":1,"openAsk":1,"lastChangeAsk":0,"lastChangeBid":0}
        function _createTableRow(data) {
            var tr = document.createElement('tr');
            for (var key in data) {
                var td = document.createElement('td');
                td.innerHTML = data[key];
                tr.appendChild(td);
            }
            tr.appendChild(_createGraphTD.call(this, data));
            return tr;
        }

        function _createGraphTD(data) {
            var td = document.createElement('td');
            const sparks = document.createElement('span');
            this.Sparkline.draw(sparks, last30SecondStore.get([data.name]));
            td.appendChild(sparks);
            return td;
        }

        function _setMidPrice(data) {
            var midPrice = (data.bestBid + data.bestAsk) / 2;
            last30SecondStore.set(data.name, midPrice);
        }

        function render(dataList) {
            this.rowsContainer.innerHTML = '';
            dataList.forEach((data) => {
                _setMidPrice(data);
                this.rowsContainer.appendChild(_createTableRow.call(this, data));
            })
        }

        return {
            render: render
        }
    })();

    HTMLEmulator.prototype = proto;
    HTMLEmulator.prototype.constructor = HTMLEmulator;

    return HTMLEmulator;
})();