/**
 * Created by aivanov on 03.01.14.
 */

function ServicesCtrl($scope, $http, sService) {
    $scope.services = sService.get(function (res) {
        $scope.services = res;
        $scope.viewStatusServer = '';
        angular.forEach($scope.services, function (value, key) {
            value.iconclass = 'glyphicon glyphicon-refresh';
            value.servericonclass = 'glyphicon glyphicon-refresh';
        });
        checkConn();
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
    };

    $scope.addService = function () {
        // выбрать массив без лишних полей. и запостить.
        var name = $scope.search.name;
        var address = $scope.search.FeatureServiceUrl;
        var ser = {"name": name, "FeatureServiceUrl": address, servericonclass: "glyphicon glyphicon-refresh", iconclass: "glyphicon glyphicon-refresh"};
        $scope.services.push(ser);
        var newarrayservices = filtServices($scope.services);
        sService.post(newarrayservices, function (res) {
            $scope.search.name = "";
            $scope.search.FeatureServiceUrl = "";
            toastr.success("", 'Сервис "'+service.name+'" добавлен.');
        });
    }
    function filtServices(arr) {
        var res = [];
        _.each(arr, function (r) {
            var filtServices = _.pick(r, 'name', 'FeatureServiceUrl');
            res.push(filtServices);
        });
        return res;
    }

    $scope.deleteService = function (service) {
        $scope.services = _.without($scope.services, service);
        newarrayservices = filtServices($scope.services);
        sService.post(newarrayservices,function (res) {
            toastr.success("", 'Сервис "'+service.name+'" удален.');
        });
    }
}