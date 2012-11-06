/**
 *
 */
jQuery(function(){
    (function(Export){
        var toolBarCTR = Spine.Controller.create({
            el : $("#toolBar"),
            module : null,
            init : function() {
                this.module = Spine.ToolBarMD.create() ;

                this.el.bind("mouseenter", (function(elem) {
                    return function() {
                        elem.stop().animate({top:"0px"},200) ;
                    }
                })(this.el));

                this.el.bind("mouseleave", (function(elem) {
                    return function() {
                        elem.stop().animate({top:"-180px"},200) ;
                    }
                })(this.el));
            },
            include: function(obj){
                this[obj.name] = obj ;
            }
        }).init() ;

        toolBarCTR.module.bind("init",function() {

            toolBarCTR.include(window.imageUploader) ;
            toolBarCTR.imageUploader.el.bind("click", function() {
                toolBarCTR.imageUploader.showUploadForm();
            });

            toolBarCTR.include(window.imageSaver) ;
            toolBarCTR.imageSaver.el.bind("click", function() {
                toolBarCTR.imageSaver.saveImage() ;
            });

            toolBarCTR.include(window.colorPallet) ;
            toolBarCTR.module.bind("showColorPallet", function(){
                toolBarCTR.colorPallet.showColorPallet.call(toolBarCTR.colorPallet) ;
                if( toolBarCTR.colorPallet.flipped === true ) {
                    toolBarCTR.el.unbind("mouseleave") ;
                }
                else {
                    toolBarCTR.el.bind("mouseleave", (function(elem) {
                        return function() {
                            elem.stop().animate({top:"-180px"},200) ;
                        }
                    })(toolBarCTR.el)) ;
                }
            }) ;
            toolBarCTR.colorPallet.el.bind("click", function() {
                toolBarCTR.module.trigger("showColorPallet") ;
            });

            toolBarCTR.include(window.shapesCTR) ;
        });

        toolBarCTR.module.trigger("init") ;

        Export.toolBarCTR = toolBarCTR ;
    })(window);
});