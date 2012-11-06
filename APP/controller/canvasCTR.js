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

        canvasCTR.module.bind("init",function() {
            var canvas = canvasCTR.el[0] ;
            var ctx = canvas.getContext("2d") ;
            ctx.lineWidth = this.lineWidth ;
            ctx.lineCap = this.lineCap ;
            ctx.strokeStyle = this.strokeStyle ;
            ctx.fillStyle = this.fillStyle ;
            ctx.clearRect(0, 0, this.width, this.height) ;

            var canvasForTools = canvasCTR.el[1] ;
            var ctx = canvasForTools.getContext("2d") ;
            ctx.lineWidth = this.lineWidth ;
            ctx.lineCap = this.lineCap ;
            ctx.strokeStyle = this.strokeStyle ;
            ctx.fillStyle = this.fillStyle ;
            ctx.clearRect(0, 0, this.width, this.height) ;

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
        canvasCTR.module.trigger("init") ;

        Export.canvasCTR = canvasCTR ;
    })(window);
});