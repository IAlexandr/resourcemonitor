/**
 * Created by aivanov on 03.01.14.
 */
function ServicesCtrl($scope, $http) {
    $scope.services = null;
    $scope.viewStatusServer = '';
    function getSer() {// получение списка сервисов
        $http.get('/services.json').success(function (res) {
            $scope.services = res;
            angular.forEach($scope.services, function (value, key) {
                value.iconclass = 'glyphicon glyphicon-refresh';
                value.servericonclass = 'glyphicon glyphicon-refresh';
            });
            checkConn();
        });
    }

    getSer();

    function checkConn() {
        //механизм проверки связи с сервисами.
        angular.forEach($scope.services, function (value, key) {
            serverCheckConnInternet(function (res) {
                if (res=='true') {
                    $scope.viewStatusServer = '';
                    checkConnFromServer(value.FeatureServiceUrl, function (r) {
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

    function checkConnFromServer(url, callback) {
        $http.get('/testurl?url=' + url).success(function (res) {
            callback(res);
        });
    }

    // проверка связи с сервисами через определенный интервал
    setInterval(checkConn, 3000);

    function serverCheckConnInternet(callback) {
        checkConnFromServer('http://google.ru', function (res) {
            callback(res);
        });

    }
}