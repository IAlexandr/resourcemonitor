/**
 * Created by aivanov on 03.01.14.
 */
var port = 3000;

var express = require('express');
var urltest = require('./lib/urltest');
var servdb = require('./lib/servdb');
var baseUrl = (require('./lib/baseurl')) ();

var app = express();
// важен порядок
app.use(express.logger('dev')); // Вывод отладочных сообщений в консоль
app.use(baseUrl + '/', express.static(__dirname + '/public'));
app.use(express.bodyParser());
servdb.ensureDb();
// маршруты
app.get(baseUrl + '/testurl', function (req, res) {
    console.log(req.query);
    var t = req.query;
    urltest.testUrl(req.query.url, function (err, result) {
        res.send(result);
    });
});

app.get(baseUrl + '/services', function (req, res) {
    res.send(servdb.getServices());
});

app.post(baseUrl + '/services', function (req, res) {
    servdb.saveServices(req.body);
    res.send('ok');
});

app.get(baseUrl + '/', function (req, res) {
    res.send(404, 'Not found');
});

app.listen(port);
console.log('сервер слушает на порту: ' + port);
console.log('базовый адрес: "' + baseUrl + '"');
