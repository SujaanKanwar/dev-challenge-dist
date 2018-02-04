/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html');
// Apply the styles in style.css to the page.
require('./site/style.css');

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

const TableModule = require('./site/table_module');
const DataHandler = require('./site/data_handler');
const HTMLHandler = require('./site/html_emulator');

// Change this to get detailed logging from the stomp library
global.DEBUG = false;

//const url = "ws://localhost:8011/stomp"
//const client = Stomp.client(url)
//client.debug = function(msg) {
//  if (global.DEBUG) {
//    console.info(msg)
//  }
//}
//
//function connectCallback() {
//    debugger;
//  document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
//}
//
//client.connect({}, connectCallback, function(error) {
//  alert(error.headers.message)
//})
//
//const exampleSparkline = document.getElementById('example-sparkline')
//Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])

document.addEventListener('DOMContentLoaded', function () {
    initPage();
});

function initPage(){
    var container = document.getElementById('root');
    var config = {
        container: container,
        sortByColumn: 'lastChangeBid'
    };
    new TableModule(config, DataHandler, HTMLHandler, window.Sparkline, window.Stomp);
}



