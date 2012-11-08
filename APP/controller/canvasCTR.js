/**
 *
 */
jQuery(function($) {
    (function(Export){

        Export.canvasCTR = Spine.Controller.create({
            el : $("canvas"),
            module : null,
            init : function() {
                this.module = Spine.CanvasMD.create() ;
                this.module.updateAttributes({
                    startPos : {},
                    width : this.el.attr("width") ,
                    height : this.el.attr("height") ,
                    foreColor : "#000000",
                    lineWidth : 3,
                    lineCap : "round",
                    strokeStyle : "#000000",
                    fillStyle : "#000000"
                }) ;
            },
            mouseDown : function() {
                this.isMouseDown = true ;
            },
            mouseUp : function() {
                //console.log(this) ;
                this.isMouseDown = false ;
                //console.log("mouseUp: " + this.isMouseDown) ;
            },
            mouseMove : function() {

            }
        }).init() ;

        canvasCTR.module.bind("bindEvent",function() {
            var canvasForTools = canvasCTR.el[1] ;

            canvasForTools.addEventListener("mousedown",function(ev) {
                ev = ev || window.event ;

                canvasCTR.module.startPos.x = ev.offsetX ;
                canvasCTR.module.startPos.y = ev.offsetY ;

                window.App.module.trigger("mouseDown") ;
            }) ;

            canvasForTools.addEventListener("mouseup",function() {
                window.App.module.trigger("mouseUp") ;
            }) ;
        });

        canvasCTR.module.bind("init",function() {
            var canvas = canvasCTR.el[0] ;
            var ctx = canvas.getContext("2d") ;
            ctx.lineWidth = this.lineWidth ;
            ctx.lineCap = this.lineCap ;
            ctx.strokeStyle = this.strokeStyle ;
            ctx.fillStyle = this.fillStyle ;

            var canvasForTools = canvasCTR.el[1] ;
            var ctx = canvasForTools.getContext("2d") ;
            ctx.lineWidth = this.lineWidth ;
            ctx.lineCap = this.lineCap ;
            ctx.strokeStyle = this.strokeStyle ;
            ctx.fillStyle = this.fillStyle ;
        });

        canvasCTR.module.trigger("init") ;
        canvasCTR.module.trigger("bindEvent") ;

        Export.canvasCTR = canvasCTR ;
    })(window);
});