/**
 * Created by aivanov on 04.01.14.
 */

var request = require('request');

module.exports.testUrl = function (url, callback){
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(null, true);
        } else {
            callback(error, false);
        }
    });
}

