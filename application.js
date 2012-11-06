/**
 * 应用程序控制器，是整个应用程序入口
 */

jQuery(function($) {
    (function(window){
        var App = Spine.Controller.create({
            el : $("body"),
            module : null,
            isMouseDown : false,
            elements : {
                "#myCanvas" : "canvasEl",
                "#toolsForShapes" : "toolsForShapesEl"
            },

            init : function() {
                this.module = Spine.DrawerMD.create() ;
                this.toolBarCTR = toolBarCTR ;
                this.canvasCTR = canvasCTR ;
            }
        }).init() ;

        App.module.bind("init",function() {
            document.onselectstart = function() { return false; };
            canvasCTR.el[1].oncontextmenu = function() { return false; };
        });

        App.module.bind("mouseDown", App.proxy(canvasCTR.mouseDown)) ;
        App.module.bind("mouseUp", App.proxy(canvasCTR.mouseUp)) ;

        App.module.trigger("init") ;

        window.App = App ;

        /*var canvas = document.getElementById("myCanvas") ;
        var ctx = canvas.getContext("2d") ;

        var img = new Image() ;
        img.src = "images/lena.bmp" ;
        img.onload = function() {
            ctx.drawImage(img, 0, 0) ;

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height) ;
            var data = imageData.data ;
            console.log(data) ;

            for( var i = 0; i < data.length; i += 4 ) {
                data[i] = data[i] < 128 ? 0 : 255 ;
                data[i+1] = data[i] < 128 ? 0 : 255 ;
                data[i+2] = data[i+2] < 128 ? 0 : 255 ;
            }

            ctx.putImageData(imageData, 0, 0) ;
        };*/
    })(window) ;
}) ;