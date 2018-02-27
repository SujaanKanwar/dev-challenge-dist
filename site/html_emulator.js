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
            return key ? store[key] : store;
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
            tr.setAttribute('name', data.name);

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
            sparks.setAttribute('class', 'js_spark');
            td.appendChild(sparks);
            return td;
        }

        function _saveMidPriceForAll(data) {
            var midPrice = (data.bestBid + data.bestAsk) / 2;
            var store = last30SecondStore.get();
            for (var key in store) {
                last30SecondStore.set(key, store[key][store[key].length - 1]);
            }
            last30SecondStore.set(data.name, midPrice);
        }

        function _sortTable(tb, col, reverse) {
            var trs = Array.prototype.slice.call(tb.getElementsByTagName('tr'), 0);
            var i;
            reverse = -((+reverse) || -1);
            trs = trs.sort(function (a, b) {
                return reverse * ( parseFloat(a.cells[col].textContent) - parseFloat(b.cells[col].textContent));
            });
            for (i = 0; i < trs.length; ++i) tb.appendChild(trs[i]);
        }


        function _addOrUpdateRow(tb, data) {
            var trs = tb.getElementsByTagName('tr');

            for (var i = 0; i < trs.length; i++) {
                if (trs[i].getAttribute('name') === data.name) {
                    break;
                }
            }
            if (i < trs.length) {
                trs[i].remove();
            }
            //add row
            var newRow = _createTableRow(data);
            tb.appendChild(newRow);
        }

        function _drawSparkLines(tb, store){
            var trs = tb.getElementsByTagName('tr');
            for(var i=0; i< trs.length; i++){
                var name = trs[i].getAttribute('name');
                var sparkSpan = trs[i].getElementsByClassName('js_spark')[0];
                Sparkline.draw(sparkSpan, store.get(name))
            }

        }

        function render(dataRow) {
            _saveMidPriceForAll(dataRow);

            _addOrUpdateRow(this.rowsContainer, dataRow);

            _drawSparkLines(this.rowsContainer, last30SecondStore);

            _sortTable(this.rowsContainer, 6, 1);

        }

        return {
            render: render
        }
    })();

    HTMLEmulator.prototype = proto;
    HTMLEmulator.prototype.constructor = HTMLEmulator;

    return HTMLEmulator;
})();