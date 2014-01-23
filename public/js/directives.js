/**
 * Created by aivanov on 15.01.14.
 */
// перетаскиваемая панель сервиса.
serviceModule.directive('dragBox', ['servicesControl', function (servicesControl) {
    return {
        templateUrl: "htmltemplates/dragBox.html",
        scope: {
            serv: '='
        },
        link: function (scope, element, attrs) {
            element.draggable({
                stop: function (evt, ui) {
                    var se = scope.serv;                    // сервис
                    se.pX = ui.position.left;
                    se.pY = ui.position.top;
                    var newarr = [];
                    servicesControl.get(function (res) {           // получение списка сервисов.
                        _.each(res, function (val) {
                            if (se.name == val.name) {
                                val = se;
                            }
                            newarr.push(_.pick(val, 'name', 'FeatureServiceUrl', 'id', 'pX', 'pY'));    // добавление сервиса в массив только с перечисленными полями.
                        });
                        servicesControl.post(newarr, function (res) {  // отправка массива с измененными координатами на сервер
                            var t = res;// сделать проверку на ответ, возможно выводить в тостере инф. сообщение об ошибке.
                        });
                        return res;
                    });
                },
                containment: "#containment-wrapper",    // див за пределы которого нельзя передвигать панель.
                cursor: "move",
                scroll: false,
                opacity: 0.80
            });
        }
    }
}]);

serviceModule.directive('boundingBox', ['setElemNewSize', '$window', function (setElemNewSize, $window) {
    return {
        templateUrl: "htmltemplates/boundingbox.html",
        restrict: 'EAC',
        link: function (scope, element, attrs) {
            var el = element;
            var win = angular.element($window);
            scope.setsize = function () {
                setElemNewSize.set(el);
            }
            scope.setsize();
            win.on("resize", scope.setsize);
            scope.$on("$destroy", function () {
                win.off("resize", scope.setsize);
            });
            element.attr('unselectable', 'on').select(function () {
                return false
            }).css({
                    '-moz-user-select': '-moz-none',
                    '-o-user-select': 'none',
                    '-khtml-user-select': 'none',
                    '-webkit-user-select': 'none',
                    'user-select': 'none'
                });
        }
    }
}]);

serviceModule.directive('descriptDrawing', ['setElemNewSize', 'schemaControl', '$window', function (setElemNewSize, schemaControl, $window) {
    return {
        template: "",
        scope: {
            cl: '=',
            clears: '='
        },
        link: function (scope, element, attrs) {
            var el = element;
            var win = angular.element($window);
            scope.img = new Image();
            scope.$watch('cl', function (c) {
                curColor = c;
            });
            scope.setsize = function () {
                setElemNewSize.set(el);
                var ww = el.css('width');
                var hh = el.css('height');
                var w = parseInt(ww);
                var h = parseInt(hh)
                el.attr({width: w, height: h});
                scope.redraw();
            }
            scope.saveCanvas = function () {
                var mime;
                mime = "image/png";
                var data = canvas.toDataURL(mime);
                schemaControl.postImg(data, function (res) {
                    //toastr.success("", 'Схема сохранена.');
                });
                scope.img = new Image();
            }
            scope.prepareCanvas = function () {
                $("body").css("overflow", "hidden");
                context = canvas.getContext("2d");
                var rrr = schemaControl.getImg(function (res) {
                    scope.img = new Image();
                    scope.img.src = res.image;
                    context.drawImage(scope.img, 0, 0);
                });
                element.mousedown(function (e) {
                    var mouseX = e.pageX - this.offsetLeft;
                    var mouseY = e.pageY - this.offsetTop;

                    paint = true;
                    scope.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
                    scope.redraw();
                });

                element.mousemove(function (e) {
                    if (paint) {
                        scope.addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                        scope.redraw();
                    }
                });

                element.mouseup(function (e) {
                    paint = false;
                    scope.saveCanvas();
                });
                element.mouseleave(function (e) {
                    //paint = false;
                });

                clickColor = new Array();
                clickX = new Array();
                clickY = new Array();
                clickDrag = new Array();
                var paint;
            }

            scope.addClick = function (x, y, dragging) {
                clickX.push(x);
                clickY.push(y);
                clickDrag.push(dragging);
                clickColor.push(curColor);
            }

            scope.redraw = function () {
                context.drawImage(scope.img, 0, 0);
                context.strokeStyle = "#df4b26";
                context.lineJoin = "round";
                context.lineWidth = 5;

                for (var i = 0; i < clickX.length; i++) {
                    context.beginPath();
                    if (clickDrag[i] && i) {
                        context.moveTo(clickX[i - 1], clickY[i - 1]);
                    } else {
                        context.moveTo(clickX[i] - 1, clickY[i]);
                    }
                    context.lineTo(clickX[i], clickY[i]);
                    context.closePath();
                    context.strokeStyle = clickColor[i];

                    context.stroke();
                }
            }

            scope.clearCanvas = function () {
                clickX = new Array();
                clickY = new Array();
                clickDrag = new Array();
                clickColor = new Array();
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                scope.saveCanvas();
            }

            scope.$parent.$parent.clear = scope.clearCanvas;
            scope.prepareCanvas();
            scope.setsize();
            win.on("resize", scope.setsize);
            scope.$on("$destroy", function () {
                win.off("resize", scope.setsize);
                win.off("resize", scope.redraw);
                $("body").css("overflow", "auto");
            });
        }
    }
}]);