// "Базовый адрес" приложения

var fs = require('fs');

module.exports = function () {
	// Чтение из файла с обработкой исключений
	try {
		var text = fs.readFileSync("baseurl.json", {encoding: 'utf-8'});
		var data = JSON.parse(text);
		if(!data.hasOwnProperty('baseurl')) {
			throw new Error("Неверный формат файла baseurl.json");
		}
		var url = data.baseurl;
	} catch (err) {
		console.error("Ошибка чтения базового адреса: ", err);
		process.exit(1);
	}

	// Если адрес = '/', преобразуем в '' для правильной работы маршрутов
	if (url == '/') {
		url = '';
	}

	return url;
};
