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
    var rr = fs.existsSync('./data/services.json');
    if (!rr) {
        var rr = fs.readFile(sampleFilePath, function (err, data) {
            if (err) throw err;
            fs.writeFile("./data/services.json", data, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The file:services.json was created!");
                }
            });
        });
    }
}
