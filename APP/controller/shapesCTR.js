/**
 *
 */
jQuery(function(){
    (function(Export){
        var shapesCTR = Spine.Controller.create({
            name : "shapesCTR",
            el : $("#shapes"),
            elements : $(".shapes"),
            module : null,
            init : function() {
                this.module = Spine.shapesMD.create() ;
                var that = this ;

                this.elements.hover(function() {
                    $(this).addClass("shapes_hover") ;
                }, function() {
                    $(this).removeClass("shapes_hover") ;
                });

                this.elements.click(function() {
                    that.elements.removeClass("shapes_clicked") ;
                    $(this).addClass("shapes_clicked") ;
                });
            },
            include: function(obj){
                this[obj.name] = obj ;
            }
        }).init() ;

        shapesCTR.module.bind("init",function() {

            shapesCTR.include(window.line) ;
            canvasCTR.module.bind("drawLine", shapesCTR.line.drawLine) ;
            shapesCTR.line.el.bind("click", function() {
                canvasCTR.module.trigger("drawLine") ;
            });

            shapesCTR.include(window.circle) ;
            canvasCTR.module.bind("drawCircle",shapesCTR.circle.drawCircle) ;
            shapesCTR.circle.el.bind("click", function() {
                canvasCTR.module.trigger("drawCircle") ;
            });

            shapesCTR.include(window.brush) ;
            canvasCTR.module.bind("drawBrush",shapesCTR.brush.drawBrush) ;
            shapesCTR.brush.el.bind("click", function() {
                canvasCTR.module.trigger("drawBrush") ;
            });

            shapesCTR.include(window.rectangle) ;
            canvasCTR.module.bind("drawRectangle", shapesCTR.rectangle.drawRectangle) ;
            shapesCTR.rectangle.el.bind("click", function() {
                canvasCTR.module.trigger("drawRectangle") ;
            });

            shapesCTR.include(window.rectangularTriangle) ;
            canvasCTR.module.bind("drawRectangularTriangle", shapesCTR.rectangularTriangle.drawRectangularTriangle) ;
            shapesCTR.rectangularTriangle.el.bind("click", function() {
                canvasCTR.module.trigger("drawRectangularTriangle") ;
            });

            shapesCTR.include(window.equilateralTriangle) ;
            canvasCTR.module.bind("drawEquilateralTriangle", shapesCTR.equilateralTriangle.drawEquilateralTriangle) ;
            shapesCTR.equilateralTriangle.el.bind("click", function() {
                canvasCTR.module.trigger("drawEquilateralTriangle") ;
            });

            shapesCTR.include(window.eraser) ;
            canvasCTR.module.bind("drawEraser", (function(size){
                return function() {
                    shapesCTR.eraser.drawEraser.call(canvasCTR.module, size) ;
                }
            })(shapesCTR.eraser.size)) ;
            shapesCTR.eraser.el.bind("click", function() {
                canvasCTR.module.trigger("drawEraser") ;
            });
        });

        shapesCTR.module.trigger("init") ;

        Export.shapesCTR = shapesCTR ;
    })(window);
});