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
        scope: true,
        link: function (scope, element, attrs) {
            var el = element;

            scope.setsize = function () {
                setElemSize.set(el);
                var ww = el.css('width');
                var hh = el.css('height');
                var w = parseInt(ww);
                var h = parseInt(hh)
                el.attr({width: w, height: h});
                scope.redraw();
            }
            scope.prepareCanvas = function () {
                $("body").css("overflow","hidden");
                context = canvas.getContext("2d");
                var rrr = sService.getImg(function (res) {
                    var img = new Image();
                    img.src = res.image;
                    context.drawImage(img,0,0);
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
                });
                element.mouseleave(function (e) {
                    //paint = false;
                });

                colorPurple = "#cb3594";
                colorGreen = "#659b41";
                colorYellow = "#ffcf33";
                colorBrown = "#986928";
                colorWhite = "#ffffff";
                colorBlack = "#000000";
                curColor = colorPurple;
                $('#downloadBtn').mousedown(function (e) {
                    var mime;
                    mime = "image/png";
                    var data =  canvas.toDataURL(mime);
                    sService.postImg(data, function (res) {
                        toastr.success("", 'Схема сохранена.');
                    });
                });
                $('#clearBtn').mousedown(function (e) {
                    scope.clearCanvas();
                });
                $('#choosePurpleSimpleColors').mousedown(function (e) {
                    curColor = colorPurple;
                });
                $('#chooseGreenSimpleColors').mousedown(function (e) {
                    curColor = colorGreen;
                });
                $('#chooseYellowSimpleColors').mousedown(function (e) {
                    curColor = colorYellow;
                });
                $('#chooseBrownSimpleColors').mousedown(function (e) {
                    curColor = colorBrown;
                });
                $('#chooseWhiteSimpleColors').mousedown(function (e) {
                    curColor = colorWhite;
                });
                $('#chooseBlackSimpleColors').mousedown(function (e) {
                    curColor = colorBlack;
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
               // context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

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
            }


            scope.prepareCanvas();
            scope.setsize();
            $(window).on("resize", scope.setsize);
        }
    }
}]);