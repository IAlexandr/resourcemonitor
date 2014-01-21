/**
 * Created by aivanov on 10.01.14.
 */
var serviceModule = angular.module('ServiceModule', ['ngRoute'])
serviceModule.config(function ($routeProvider) {
    $routeProvider
        .when('/table', {templateUrl: 'partials/table.html', controller: 'ServicesCtrl'})
        .when('/schema', {templateUrl: 'partials/schema.html', controller: 'ServicesCtrl'})
        .otherwise({redirectTo: '/table'});
});
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
}]);
serviceModule.factory('setElemSize', function () {
    var services = {};
    services.set = function (elem) {
        var w = $(window).width();
        var h = $(window).height() - 77;
        elem.width(w);
        elem.height(h);
    };
    return services;
});