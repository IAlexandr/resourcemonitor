/**
 * Created by aivanov on 15.01.14.
 */

serviceModule.directive('dragBox', function () {
    return {
        templateUrl: "htmltemplates/dragBox.html",
        scope: {
            serv: '='
        },
        link: function (scope, element, attrs) {;
            element.draggable({ cursor: "move", grid: [ 5, 5 ] });
        }
    }
});