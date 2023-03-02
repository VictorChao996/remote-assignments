var request = require('sync-request');
var colors = require('colors');
const url = "https://api.appworks-school-campus3.online/api/v1/clock/delay";

// write code to request url synchronously
function requestSync(url) {
    const startTime = Date.now();
    var res = request('GET', url);
    const endTime = Date.now();
    console.log(`${endTime-startTime}`.yellow);
}
requestSync(url) // would print out the execution time
requestSync(url)
requestSync(url)