/**
 *
 */
jQuery(function(){
    (function(Export){
        var equilateralTriangle = {
            name : "equilateralTriangle",
            el : $("#equilateralTriangle"),
            drawEquilateralTriangle : function() {
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
                    ctx.moveTo(startX, currY) ;
                    ctx.lineTo(currX, currY) ;
                    ctx.lineTo((currX+startX)/2, startY) ;
                    ctx.closePath() ;
                    ctx.stroke() ;

                    ctxForTool.clearRect(0, 0, canvasCTR.module.width, canvasCTR.module.height) ;
                };

                canvasForTools.onmouseout = function() {
                    return false ;
                };

                canvasForTools.onmousedown = function() {
                    ctxForTool.lineWidth = canvasCTR.module.lineWidth ;
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
                        ctxForTool.moveTo(startX, currY) ;
                        ctxForTool.lineTo(currX, currY) ;
                        ctxForTool.lineTo((currX+startX)/2, startY) ;
                        ctxForTool.closePath() ;
                        ctxForTool.stroke() ;
                    }
                };
            }
        } ;

        Export.equilateralTriangle = equilateralTriangle ;
    })(window);
});