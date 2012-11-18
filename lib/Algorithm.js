
var Algorithm = function() {

    var partition = function(array, low, high, cmp) {
        var pivot ;
        var i ;
        var last_small ;
        var temp ;

        temp = array[low] ;
        array[low] = array[parseInt((low+high)/2)] ;
        array[parseInt((low+high)/2)] = temp ;

        pivot = array[low] ;
        last_small = low ;

        if( cmp ) {
            for( var i = low + 1; i <= high; i ++ ) {
                if( cmp(array[i], pivot) === -1 ) {
                    last_small = last_small + 1 ;
                    temp = array[last_small] ;
                    array[last_small] = array[i] ;
                    array[i] = temp ;
                }
            }
        }
        else {
            for( var i = low + 1; i <= high; i ++ ) {
                if( array[i] < pivot ) {
                    last_small = last_small + 1 ;
                    temp = array[last_small] ;
                    array[last_small] = array[i] ;
                    array[i] = temp ;
                }
            }
        }

        temp = array[last_small] ;
        array[last_small] = array[low] ;
        array[low] = temp ;

        return last_small ;
    };

     this.quickSort = function(src, low, high, cmp) {
         var pivot_position ;

         if( low < high ) {
             if( cmp ) {
                 pivot_position = partition(src,low,high,cmp)
                 arguments.callee(src,low,pivot_position-1,cmp) ;
                 arguments.callee(src,pivot_position+1,high,cmp) ;
             }
             else {
                 pivot_position = partition(src,low,high)
                 arguments.callee(src,low,pivot_position-1) ;
                 arguments.callee(src,pivot_position+1,high) ;
             }
         }
    };
};