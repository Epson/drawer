/**
 *
 */
jQuery(function(){
    (function(Export){
        var imageProcessor = {
            name : "imageProcessor",
            el : $("#imageProcessor"),
            changeGrayResolution : function() {
                var canvas = canvasCTR.el[0] ;
                var ctx = canvas.getContext("2d") ;
            }
        } ;

        Export.imageProcessor = imageProcessor ;
    })(window);
});