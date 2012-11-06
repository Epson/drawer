/*
 * map module
 */
jQuery(function($){
    var CanvasMD = Spine.CanvasMD = Spine.Model.setup("CanvasMD",["startPos","width","height","foreColor",
        "lineWidth","lineCap","strokeStyle","fillStyle"]);

    CanvasMD.extend(Spine.Model.Local) ;
});
