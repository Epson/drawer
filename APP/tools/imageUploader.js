/**
 *
 */
jQuery(function(){
    (function(Export){
        var imageUploader = {
            name : "imageUploader",
            el : $("#imageUploader"),
            element : $("#formForOpen"),
            init : function() {
                var open = document.getElementById("open") ;
                open.onclick = (function(context) {
                    return function() {
                        context.uploadImage() ;
                    }
                })(this);

                var maskLayer = document.getElementById("maskLayer") ;
                maskLayer.onclick = (function(context) {
                    return function() {
                        context.hideUploadForm() ;
                    }
                })(this);
            },
            showUploadForm : function() {
                this.element.show() ;
                $("#maskLayer").show("slow") ;
            },
            hideUploadForm : function() {
                this.element.hide() ;
                $("#maskLayer").hide("slow") ;
            },
            uploadImage : function() {
                var that = this ;
                var fileObj = document.getElementById("image").files[0];        // 获取文件对象

                var FileController = "php/uploadFile.php";                      // 接收上传文件的后台地址

                // FormData 对象
                var form = new FormData();
                form.append("author", "epson");                                 // 可以增加表单数据
                form.append("image", fileObj);                                  // 文件对象

                // XMLHttpRequest 对象
                var xhr = new XMLHttpRequest();
                xhr.open("post", FileController, true);
                xhr.onreadystatechange = function()
                {
                    if( xhr.readyState == 4 )
                    {
                        var res = xhr.responseText ;

                        that.showImage(res) ;
                        that.hideUploadForm();
                    }
                }

                xhr.send(form);
            },
            showImage : function(fileName) {
                var canvas = canvasCTR.el[0] ;
                var ctx = canvas.getContext("2d") ;
                var canvasForTools = canvasCTR.el[1] ;

                var img = new Image() ;
                img.src = "upload/" + fileName;
                //img.src = fileName ;
                img.onload = function() {
                    canvas.width = img.naturalWidth ;
                    canvas.height = img.naturalHeight ;
                    ctx.drawImage(img, 0, 0) ;
                    canvasForTools.width = img.naturalWidth ;
                    canvasForTools.height = img.naturalHeight ;

                    canvas.parentNode.style.width = img.naturalWidth ;
                    canvas.parentNode.style.height = img.naturalHeight ;
                    canvasCTR.el.parent().css({
                        "width": img.naturalWidth + "px",
                        "height": img.naturalHeight + "px",
                        "marginLeft" : -( img.naturalWidth / 2 ) + "px"
                    }) ;

                    canvasCTR.module.trigger("init") ;
                };
            }
        } ;

        imageUploader.init() ;

        Export.imageUploader = imageUploader ;
    })(window);
});