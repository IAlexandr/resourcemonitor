/**
 * Created by aivanov on 04.01.14.
 */
var sampleFilePath = './sample.json';
var filePath = './data/services.json';
var imgFilePath = './data/img.json';

var fs = require('fs');

module.exports.getServices = function () {
    return fs.readFileSync(filePath);
}

module.exports.saveServices = function (data) {
    fs.writeFileSync(filePath, JSON.stringify(data));
}

module.exports.ensureDb = function () {
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }
    if (!fs.existsSync(filePath)) {
        var sampleFileData = fs.readFileSync(sampleFilePath);
        fs.writeFileSync(filePath, sampleFileData);
    }
    if (!fs.existsSync(imgFilePath)) {
        fs.writeFileSync(imgFilePath, "{'image':''}");
    }
}

module.exports.getImg = function () {
    return fs.readFileSync(imgFilePath);
}
module.exports.saveImg = function (data) {
    fs.writeFileSync(imgFilePath, JSON.stringify(data));
}
