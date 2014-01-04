/**
 * Created by aivanov on 03.01.14.
 */
function ServicesCtrl($scope, $http){
    $scope.services = null;
    function getSer(){// получение списка сервисов
        $http.get('/services.json').success(function (res){
            $scope.services = res;
        });
    }
    getSer();
    $scope.checkConnect = function (){
       //механизм проверки связи с сервисами.
        angular.forEach($scope.services, function(value, key){
            $http.get(value.FeatureServiceUrl)
                .success(function (res){
                    value.status = true;
                })
                .error(function (data, status, headers, config){
                    value.status = false;
                });
        });
    }
}