/**
 *
 */
jQuery(function(){
    (function(Export){
        var brush = {
            name : "brush",
            el : $("#brush"),
            drawBrush : function() {
                var canvas = canvasCTR.el[0] ;
                var canvasForTools = canvasCTR.el[1] ;
                var ctx = canvas.getContext("2d") ;

                canvasForTools.onmousedown = function(ev) {
                    ev = ev || window.event ;

                    ctx.beginPath() ;
                    ctx.moveTo(ev.offsetX, ev.offsetY) ;
                } ;

                canvasForTools.onmouseup = function() {
                    return false ;
                };

                canvasForTools.onmouseout = function() {
                    return false ;
                };

                canvasForTools.onmousemove = function(ev) {
                    ev = ev || window.event ;

                    if( window.App.isMouseDown === true ) {
                        ctx.lineTo(ev.offsetX, ev.offsetY) ;
                        ctx.stroke() ;
                    }
                };
            }
        } ;

        Export.brush = brush ;
    })(window);
});