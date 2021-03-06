/**
 * Created by aivanov on 10.01.14.
 */
var serviceModule = angular.module('ServiceModule', []);

serviceModule.factory('sService', ['$http', function ($http) {
    var services = {};
    services.get = function (callback) {
        return $http.get('services').success(function (res) {
            callback(res);
            return res;
        });
    };
    services.checkConnection = function (url, callback) {
        $http.get('testurl?url=' + url, {cache: false}).success(function (res) {
            callback(res);
        });
    };
    services.post = function (newarrayservices, callback) {
        $http.post('services', newarrayservices)
            .success(function (res) {
                callback(res);
            });
    };
    return services;
}])