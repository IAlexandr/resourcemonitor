/**
 * Created by aivanov on 15.01.14.
 */

serviceModule.directive('dragBox', ['sService', function (sService) {
    return {
        templateUrl: "htmltemplates/dragBox.html",
        scope: {
            serv: '='
        },
        link: function (scope, element, attrs) {
            element.draggable({
                stop: function(evt, ui) {
                    var se = scope.serv;
                    se.pX = ui.position.left;
                    se.pY = ui.position.top;
                    var newarr = [];
                    sService.get(function (res) {
                        _.each(res, function (val) {
                            if (se.name == val.name){
                                val = se;
                            }
                            newarr.push(_.pick(val, 'name', 'FeatureServiceUrl', 'id', 'pX', 'pY'));
                        });
                        sService.post(newarr, function (res){
                            var t = res;
                        });
                        return res;
                    });
                },
                containment: "#containment-wrapper",
                cursor: "move",
                scroll: false,
                opacity: 0.80
            });
        }
    }
}]);