// "Базовый адрес" приложения

var fs = require('fs');

module.exports = function () {
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

	return url;	
};