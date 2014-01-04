/**
 * Created by aivanov on 03.01.14.
 */
function ServicesCtrl($scope, $http){
    $scope.services = null;
    function getSer(){// получение списка сервисов
        $http.get('/services.json').success(function (res){
            $scope.services = res;
            angular.forEach($scope.services, function(value, key){
                value.iconclass = 'glyphicon glyphicon-refresh';
            });
            checkConn();
        });
    }
    getSer();
    function checkConn(){
       //механизм проверки связи с сервисами.
        angular.forEach($scope.services, function(value, key){
            $http.get(value.FeatureServiceUrl)
                .success(function (res){
                    value.status = 'ok';
                    value.iconclass = 'glyphicon glyphicon-ok-sign';
                })
                .error(function (data, status, headers, config){
                    value.status = 'bad';
                    value.iconclass = 'glyphicon glyphicon-minus-sign';
                });
        });
    }
    // проверка связи с сервисами через определенный интервал
    setInterval(checkConn, 5000);
}