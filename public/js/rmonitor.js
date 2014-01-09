/**
 * Created by aivanov on 03.01.14.
 */

var serviceModule = angular.module('ServiceModule', []);
serviceModule.factory('sService', ['$http', function ($http) {
    var services = {};
    services.get = function (callback) {
        return $http.get('/services').success(function (res) {
            callback(res);
            return res;
        });
    };
    services.checkConnection = function (url, callback) {
        $http.get('/testurl?url=' + url).success(function (res) {
            callback(res);
        });
    };
    return services;
}]);

function ServicesCtrl($scope, $http, sService) {
    $scope.services = sService.get(function (res) {
        $scope.services = res;
        $scope.viewStatusServer = '';
        angular.forEach($scope.services, function (value, key) {
            value.iconclass = 'glyphicon glyphicon-refresh';
            value.servericonclass = 'glyphicon glyphicon-refresh';
        });
        //checkConn();
    });

    function checkConn() {
        //механизм проверки связи с сервисами.
        angular.forEach($scope.services, function (value, key) {
            serverCheckConnInternet(function (res) {
                if (res == 'true') {
                    $scope.viewStatusServer = '';
                    sService.checkConnection(value.FeatureServiceUrl, function (r) {
                        if (r) {
                            value.statusServer = "ok";
                            value.servericonclass = 'glyphicon glyphicon-ok-sign';
                        } else {
                            value.statusServer = "bad";
                            value.servericonclass = 'glyphicon glyphicon-minus-sign';
                        }
                    })
                } else {
                    $scope.viewStatusServer = 'glyphicon glyphicon-minus-sign';
                    value.statusServer = '';
                    value.servericonclass = 'glyphicon glyphicon-refresh';
                }
            });
            $http.get(value.FeatureServiceUrl)
                .success(function (res) {
                    value.statusBrowser = 'ok';
                    value.iconclass = 'glyphicon glyphicon-ok-sign';
                })
                .error(function (data, status, headers, config) {
                    value.statusBrowser = 'bad';
                    value.iconclass = 'glyphicon glyphicon-minus-sign';
                });
        });
    }

// проверка связи с сервисами через определенный интервал
    setInterval(checkConn, 3000);

    function serverCheckConnInternet(callback) {
        sService.checkConnection('http://google.ru', function (res) {
            callback(res);
        })
    }
}