/**
 *
 */
jQuery(function(){
    (function(Export){
        var imageProcessor = {
            name : "imageProcessor",
            el : $("#ToolForChangeGrayResolution"),
            srcImageData : null,
            init : function() {
                var canvas = canvasCTR.el[0] ;
                var ctx = canvas.getContext("2d") ;
                var width = canvas.width ;
                var height = canvas.height ;
                this.srcImageData = ctx.getImageData(0, 0, width, height) ;
            },
            ReduceToGrayLevelSolution : function(targetSolution) {

                if( targetSolution === 1 ) {
                    var imageData = arguments.callee.call(this,8) ;
                    var data = imageData.data ;
                    var length = data.length ;
                    for( var i = 0; i < length; i += 4) {
                        if( data[i] < 128 ) {
                            data[i] = 0 ;
                            data[i+1] = 0 ;
                            data[i+2] = 0 ;
                        } else {
                            data[i] = 255 ;
                            data[i+1] = 255 ;
                            data[i+2] = 255 ;
                        }
                    }
                } else if( targetSolution === 8 ) {
                    var imageData = this.srcImageData ;
                    var data = imageData.data ;
                    var length = data.length ;

                    for( var i = 0; i < length; i += 4 ) {
                        var value = data[i] ;
                        data[i] = value  ;
                        data[i+1] = value ;
                        data[i+2] = value ;
                    }

                } else {
                    var imageData = arguments.callee.call(this,8) ;
                    var data = imageData.data ;
                    var length = data.length ;
                    var interval = 256 / Math.pow(2, targetSolution) ;

                    for( var i = 0; i < length; i += 4 ) {
                        var value = parseInt( data[i] / interval ) * interval + parseInt( interval / 2 ) ;
                        data[i] = value ;
                        data[i+1] = value ;
                        data[i+2] = value ;
                    }
                }

                return imageData ;
            },

            showImage : function(imageData) {
                var ctx = canvasCTR.el[0].getContext("2d") ;

                ctx.putImageData(imageData, 0, 0) ;
            }
        } ;

        Export.imageProcessor = imageProcessor ;
    })(window);
});