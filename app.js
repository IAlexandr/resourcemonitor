/**
 * Created by aivanov on 03.01.14.
 */
var port = 3000;

var express = require('express');
var urltest = require('./lib/urltest');

var app = express();
// важен порядок
app.use(express.logger('dev')); // Вывод отладочных сообщений в консоль
app.use(express.static(__dirname + '/public'));

// маршруты
app.get('/testurl', function(req, res){
    console.log(req.query);
    var t = req.query;
    urltest.testUrl(req.query.url, function(err, result){
        res.send(result);
    });
});

app.get('/',function(req, res){
    res.send(404, 'Not found');
});

app.listen(port);
console.log('сервер слушает на порту: ' + port);