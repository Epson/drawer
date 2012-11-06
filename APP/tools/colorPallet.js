/**
 *
 */
jQuery(function($){
    (function(Export){
        var colorPallet = {
            name : "colorPallet",
            el : $("#colorPallet"),
            element : $("#panelForColorPallet"),
            flipped : false,
            init : function() {
                var left = this.el[0].offsetLeft - this.element[0].offsetWidth / 2 + this.el[0].offsetWidth / 2 ;
                this.element.css("left",left+"px") ;

                this.element.hide() ;
            },
            showColorPallet : function() {
                if( this.flipped === false ) {
                    this.element.slideDown(200) ;
                    var that = this ;
                    setTimeout(function(){
                        that.element.addClass("colorPallet-flipped")
                    },200) ;
                    this.flipped = true ;
                }
                else {
                    this.element.removeClass("colorPallet-flipped") ;
                    var that = this;
                    setTimeout(function() {
                        that.element.slideUp(200) ;
                    },300) ;
                    this.flipped = false ;
                }
            }
        } ;

        colorPallet.init() ;

        Export.colorPallet = colorPallet ;
    })(window);
});