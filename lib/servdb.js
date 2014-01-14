/**
 * Created by aivanov on 04.01.14.
 */
var sampleFilePath = './sample.json';
var filePath = './data/services.json';

var fs = require('fs');

module.exports.getServices = function () {
    return fs.readFileSync(filePath);
}

module.exports.saveServices = function (data) {
    fs.writeFileSync(filePath, JSON.stringify(data));
}

module.exports.ensureDb = function () {
    if (!fs.existsSync('./data')) {
        fs.mkdir('./data');
    }
    if (!fs.existsSync('./data/services.json')) {
        var sampleFileData = fs.readFileSync(sampleFilePath);
        fs.writeFileSync("./data/services.json", sampleFileData);
    }
}
