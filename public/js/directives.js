/**
 * Created by aivanov on 15.01.14.
 */

angular.module('helloDrag', ['ServiceModule'])
    .directive('dragBox', function () {
        return {
            templateUrl: "templatedragg.html",
            scope: {
                serv: '='
            },
            link: function (scope, element, attrs) {
                console.log(scope);
                element.draggable({ cursor: "move", grid: [ 5, 5 ] });
            }
        }
    });