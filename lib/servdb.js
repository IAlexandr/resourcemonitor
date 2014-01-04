/**
 * Created by aivanov on 04.01.14.
 */
var filePath = './services.json';

var fs = require('fs');

module.exports.getServices = function () {
    return fs.readFileSync(filePath);
}

module.exports.saveServices = function (data) {
    fs.writeFileSync(filePath, JSON.stringify(data));
}
