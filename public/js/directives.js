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
                stop: function (evt, ui) {
                    var se = scope.serv;
                    se.pX = ui.position.left;
                    se.pY = ui.position.top;
                    var newarr = [];
                    sService.get(function (res) {
                        _.each(res, function (val) {
                            if (se.name == val.name) {
                                val = se;
                            }
                            newarr.push(_.pick(val, 'name', 'FeatureServiceUrl', 'id', 'pX', 'pY'));
                        });
                        sService.post(newarr, function (res) {
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

serviceModule.directive('contWrap', ['setElemSize', function (setElemSize) {
    return {
        templateUrl: "htmltemplates/containmentwrapper.html",
        restrict: 'EAC',
        controller: function ($scope, $element, $attrs) {
            $scope.$on("$destroy", function () {
                $(window).off("resize", $scope.setsize);
            });
        },
        link: function (scope, element, attrs) {
            var el = element;

            scope.setsize = function () {
                setElemSize.set(el);
            }
            scope.setsize();
            $(window).on("resize", scope.setsize);
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

serviceModule.directive('descriptDrawing', ['setElemSize', 'sService', function (setElemSize, sService) {
    return {
        template: "",
        controller: function ($scope, $element, $attrs) {
            $scope.$on("$destroy", function () {
                $(window).off("resize", $scope.setsize);
                $(window).off("resize", $scope.redraw);
                $("body").css("overflow","auto");
            });
        },
        scope: {
            cl: '=',
            clears: '='
        },
        link: function (scope, element, attrs) {
            var el = element;
            scope.img = new Image();
            scope.$watch('cl', function (c) {
                curColor = c;
            });
            scope.setsize = function () {
                setElemSize.set(el);
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
                var data =  canvas.toDataURL(mime);
                sService.postImg(data, function (res) {
                    //toastr.success("", 'Схема сохранена.');
                });
            }
            scope.prepareCanvas = function () {
                $("body").css("overflow","hidden");
                context = canvas.getContext("2d");
                var rrr = sService.getImg(function (res) {
                    scope.img = new Image();
                    scope.img.src = res.image;
                    context.drawImage(scope.img,0,0);
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
                context.drawImage(scope.img,0,0);
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

            scope.saveCanvas();
            scope.prepareCanvas();
            scope.setsize();
            $(window).on("resize", scope.setsize);
        }
    }
}]);