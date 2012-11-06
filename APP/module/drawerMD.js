/*
 * map module
 */
$(function(){
    var DrawerMD =Spine.DrawerMD = Spine.Model.setup("DrawerMD");
    //add local storage
    DrawerMD.extend(Spine.Model.Local);
});
