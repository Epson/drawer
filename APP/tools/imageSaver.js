/**
 *
 */
jQuery(function(){
    (function(Export){
        var imageSaver = {
            name: "imageSaver",
            el: $("#imageSaver"),
            element: $("#formForOpen"),
            saveImage: function() {
                var canvas = canvasCTR.el[0] ;

                var strData = canvas.toDataURL("png");
                document.location.href = strData.replace("png", "image/octet-stream") ;
            }
        } ;

        Export.imageSaver = imageSaver ;
    })(window);
});