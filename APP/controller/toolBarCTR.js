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
            toolBarCTR.module.bind("showColorPallet", function() {

            }) ;
            toolBarCTR.colorPallet.el.bind("click", function() {
                toolBarCTR.module.trigger("showColorPallet") ;
            });
        });

        toolBarCTR.module.trigger("init") ;

        Export.toolBarCTR = toolBarCTR ;
    })(window);
});