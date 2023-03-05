const https = require('node:https');
var colors = require('colors');
const url = "https://api.appworks-school-campus3.online/api/v1/clock/delay";
let currentTime = 0;    //current time variable for all functions

function requestCallback(url, callback) {
    const startTime = Date.now();
    // console.log(`start: ${Date.now()}`);
    // write code to request url asynchronously
    var data = "";
    https.get(url, (res)=>{
        res.on('data', (d) => {
            data += d.toString();
        }).on('end', () =>{
            currentTime = JSON.parse(data).data.now;
            currentTime /= 1000000; 
            // console.log(`currentTime: ${currentTime}`);
            console.log(`call requestCallback:`.gray);
            callback(`${currentTime - startTime}`.yellow);
        });
    });
 
}
function requestPromise(url) {
    const startTime = Date.now();
 // write code to request url asynchronously with Promise
    return new Promise(function(resolve, reject) {
        var data = "";
        return new https.get(url, (res) => {
            res.on('data', (d) => {
                data += d.toString();
            }).on('end', () =>{
                currentTime = JSON.parse(data).data.now;
                currentTime /= 1000000; 
                // console.log(`currentTime: ${currentTime}`);
                console.log(`call requestPromise: `.gray);
                resolve(`${currentTime-startTime}`.yellow);
            });
        }).on('error',(e)=>{
            reject(e.red);
        });
    });
}
async function requestAsyncAwait(url) {
 // write code to request url asynchronously
 // you should call requestPromise here and get the result using async/await.
    const result = await requestPromise(url);
    console.log(`call requestAsyncAwait:`.gray);
    console.log(`${result}`.yellow);
}


requestCallback(url, console.log); // would print out the execution time
requestPromise(url).then(console.log);
requestAsyncAwait(url);
