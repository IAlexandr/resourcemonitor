/**
 * Created by aivanov on 03.01.14.
 */
var port = 3000;

var express = require('express');

var app = express();
// важен порядок
app.use(express.logger('dev')); // Вывод отладочных сообщений в консоль
app.use(express.static(__dirname + '/public'));
app.use('/',function(req, res){
    res.send(404,'Not found');
});
app.listen(port);
console.log('сервер слушает на порту: ' + port);