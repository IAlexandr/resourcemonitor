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
    fs.exists('./data/services.json', function (exists) {
        if (!exists) {
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
    });
}