/**
 *
 */
jQuery(function(){
    (function(Export){
        var eraser = {
            name : "eraser",
            el : $("#eraser"),
            size : 100,
            drawEraser : function(size) {
                var canvas = canvasCTR.el[0] ;
                var canvasForTools = canvasCTR.el[1] ;
                var ctx = canvas.getContext("2d") ;
                var ctxForTool = canvasForTools.getContext("2d") ;

                ctxForTool.lineWidth = 1 ;

                canvasForTools.onmouseout = function() {
                    ctxForTool.clearRect(0, 0, canvasCTR.module.width, canvasCTR.module.height) ;
                };

                canvasForTools.onmouseup = function() {
                    return false ;
                };

                canvasForTools.onmousedown = function(ev) {
                    ev = ev || window.event ;
                    ctxForTool.lineWidth = 1 ;

                    var dis = size / 2 ;
                    var currX = ev.offsetX ;
                    var currY = ev.offsetY ;

                    ctx.clearRect(currX-dis, currY-dis, size, size) ;
                };

                canvasForTools.onmousemove = function(ev) {
                    ev = ev || window.event ;
                    var currX = ev.offsetX ;
                    var currY = ev.offsetY ;

                    var dis = size / 2 ;

                    ctxForTool.clearRect(0, 0, canvasCTR.module.width, canvasCTR.module.height) ;
                    ctxForTool.beginPath() ;
                    ctxForTool.moveTo(currX-dis, currY-dis) ;
                    ctxForTool.lineTo(currX+dis, currY-dis) ;
                    ctxForTool.lineTo(currX+dis, currY+dis) ;
                    ctxForTool.lineTo(currX-dis, currY+dis) ;
                    ctxForTool.closePath() ;
                    ctxForTool.stroke() ;

                    //console.log(currX+dis) ;

                    if( window.App.isMouseDown === true ) {
                        ctx.clearRect(currX-dis, currY-dis, size, size) ;
                    }
                };
            }
        } ;

        Export.eraser = eraser ;
    })(window);
});