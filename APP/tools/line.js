/**
 *
 */
jQuery(function(){
    (function(Export){
        var line = {
            name : "line",
            el : $("#line"),
            drawLine : function() {
                var canvas = canvasCTR.el[0] ;
                var canvasForTools = canvasCTR.el[1] ;
                var ctx = canvas.getContext("2d") ;
                var ctxForTool = canvasForTools.getContext("2d") ;

                canvasForTools.onmouseup = function(ev) {
                    var startX = canvasCTR.module.startPos.x ;
                    var startY = canvasCTR.module.startPos.y ;
                    var currX = ev.offsetX ;
                    var currY = ev.offsetY ;

                    ctx.beginPath() ;
                    ctx.moveTo(startX, startY) ;
                    ctx.lineTo(currX, currY) ;
                    ctx.stroke() ;

                    ctxForTool.clearRect(0, 0, canvasCTR.module.width, canvasCTR.module.height) ;
                };

                canvasForTools.onmousedown = function() {
                    ctxForTool.lineWidth = canvasCTR.module.lineWidth ;
                };

                canvasForTools.onmouseout = function() {
                    return false ;
                };

                canvasForTools.onmousemove = function(ev) {
                    ev = ev || window.event ;

                    if( window.App.isMouseDown === true ) {
                        var startX = canvasCTR.module.startPos.x ;
                        var startY = canvasCTR.module.startPos.y ;
                        var currX = ev.offsetX ;
                        var currY = ev.offsetY ;

                        ctxForTool.clearRect(0, 0, canvasCTR.module.width, canvasCTR.module.height) ;
                        ctxForTool.beginPath() ;
                        ctxForTool.moveTo(startX, startY) ;
                        ctxForTool.lineTo(currX, currY) ;
                        ctxForTool.stroke() ;
                    }
                };
            }
        } ;

        Export.line = line ;
    })(window);
});