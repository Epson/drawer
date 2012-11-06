/**
 *
 */
jQuery(function(){
    (function(Export){
        var circle = {
            name : "circle",
            el : $("#circle"),
            drawCircle : function() {
                var canvas = canvasCTR.el[0] ;
                var canvasForTools = canvasCTR.el[1] ;
                var ctx = canvas.getContext("2d") ;
                var ctxForTool = canvasForTools.getContext("2d") ;
                var radius ;

                ctxForTool.lineWidth = canvasCTR.module.lineWidth ;

                canvasForTools.onmouseup = function(ev) {
                    var startX = canvasCTR.module.startPos.x ;
                    var startY = canvasCTR.module.startPos.y ;
                    var currX = ev.offsetX ;
                    var currY = ev.offsetY ;

                    ctx.beginPath() ;
                    ctx.arc((startX+currX)/2, (startY+currY)/2, radius, 0, 2*Math.PI, true) ;
                    ctx.closePath() ;
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

                        radius = Math.abs(startX-currX) > Math.abs(startY-currY) ?
                            Math.abs(startX-currX) / 2 : Math.abs(startY-currY) / 2 ;

                        ctxForTool.clearRect(0, 0, canvasCTR.module.width, canvasCTR.module.height) ;
                        ctxForTool.beginPath() ;
                        ctxForTool.arc((startX+currX)/2, (startY+currY)/2, radius, 0, 2*Math.PI, true) ;
                        ctxForTool.closePath() ;
                        ctxForTool.stroke() ;
                    }
                };
            }
        } ;

        Export.circle = circle ;
    })(window);
});