/**
 *
 */
jQuery(function(){
    (function(Export){
        var imageProcessorCTR = Spine.Controller.create({
            name: "imageProcessorCTR",
            el: $("#imageProcessor"),
            panel: $("#ImagePanel"),
            elements: [$("#grayLevel"),$("#filter")],
            filters: null,
            init: function() {
                this.filters = {
                    averageFilter: [    0.111, 0.111, 0.111,
                                        0.111, 0.111, 0.111,
                                        0.111, 0.111, 0.111  ]
                };
            },
            showImagePanel: function() {
                this.panel.animate({top:"0px"},200);
            },
            hideImagePanel: function() {
                this.panel.animate({top:"-180px"},200);
            },
            ReduceToGrayLevelSolution: function(canvas, targetSolution) {
                if( targetSolution === 1 ) {
                    var imageData = arguments.callee.call(this, canvas, 8);
                    var data = imageData.data;
                    var length = data.length;
                    for( var i = 0; i < length; i += 4) {
                        if( data[i] < 128 ) {
                            data[i] = 0;
                            data[i+1] = 0;
                            data[i+2] = 0;
                        } else {
                            data[i] = 255;
                            data[i+1] = 255;
                            data[i+2] = 255;
                        }
                    }
                } else if( targetSolution === 8 ) {
                    var imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
                    var data = imageData.data;
                    var length = data.length;

                    for( var i = 0; i < length; i += 4 ) {
                        var value = data[i];
                        data[i] = value;
                        data[i+1] = value;
                        data[i+2] = value;
                    }

                } else {
                    var imageData = arguments.callee.call(this, canvas, 8) ;
                    var data = imageData.data;
                    var length = data.length;
                    var interval = 256 / Math.pow(2, targetSolution);

                    for( var i = 0; i < length; i += 4 ) {
                        var value = parseInt( data[i] / interval ) * interval + parseInt( interval / 2 );
                        data[i] = value;
                        data[i+1] = value;
                        data[i+2] = value;
                    }
                }

                return imageData ;
            },
            calculateConvolution: function(canvas, filter) {
                var width = canvas.width;
                var height = canvas.height;
                var ctx = canvas.getContext("2d");
                var inputData = ctx.getImageData(0, 0, width, height).data;
                var sizeOfFilter = Math.sqrt(filter.length);
                var newImageData;

                //padding
                var newWidth = width + 2 * ( sizeOfFilter - 1 );
                var newHeight = height + 2 * ( sizeOfFilter - 1 );
                var indexOfSrcData = 0;
                newImageData = ctx.createImageData(newWidth, newHeight);
                for( var i = 0; i < sizeOfFilter - 1; i ++ ) {
                    for( var j = 0 ; j < newWidth; j ++ ) {
                        var index = (i * newWidth + j) * 4;
                        newImageData.data[index] = 0;
                        newImageData.data[index+1] = 0;
                        newImageData.data[index+2] = 0;
                        newImageData.data[index+3] = 255;
                    }
                }
                for( var i = sizeOfFilter - 1; i < height + sizeOfFilter - 1; i ++ ) {
                    for( var j = 0; j < sizeOfFilter - 1; j ++ ) {
                        var index = (i * newWidth + j) * 4;
                        newImageData.data[index] = 0;
                        newImageData.data[index+1] = 0;
                        newImageData.data[index+2] = 0;
                        newImageData.data[index+3] = 255;
                    }
                    for( var j = sizeOfFilter - 1; j < sizeOfFilter - 1 + width; j ++ ) {
                        var index = (i * newWidth + j) * 4;
                        newImageData.data[index] = inputData[indexOfSrcData++];
                        newImageData.data[index+1] = inputData[indexOfSrcData++];
                        newImageData.data[index+2] = inputData[indexOfSrcData++];
                        newImageData.data[index+3] = inputData[indexOfSrcData++];
                    }
                    for( var j = sizeOfFilter - 1 + width; j < newWidth; j ++ ) {
                        var index = (i * newWidth + j) * 4;
                        newImageData.data[index] = 0;
                        newImageData.data[index+1] = 0;
                        newImageData.data[index+2] = 0;
                        newImageData.data[index+3] = 255;
                    }
                }
                for( var i = height + sizeOfFilter - 1; i < height + 2 * (sizeOfFilter - 1); i ++ ) {
                    for( var j = 0 ; j < newWidth; j ++ ) {
                        var index = (i * newWidth + j) * 4;
                        newImageData.data[index] = 0;
                        newImageData.data[index+1] = 0;
                        newImageData.data[index+2] = 0;
                        newImageData.data[index+3] = 255;
                    }
                }

                //Convolution
                for( var i = sizeOfFilter - 1; i < newHeight - ( sizeOfFilter - 1 ); i ++ ) {
                    for( var j = sizeOfFilter - 1; j < newWidth - ( sizeOfFilter - 1 ); j ++ ) {
                        var index = (i * newWidth + j) * 4;
                        newImageData.data[index] = newImageData.data[((i-1)*newWidth+j-1)*4] * filter[0] +
                            newImageData.data[((i-1)*newWidth+j)*4] * filter[1] + newImageData.data[((i-1)*newWidth+j+1)*4] * filter[2] +
                            newImageData.data[(i*newWidth+j-1)*4] * filter[3] + newImageData.data[(i*newWidth+j)*4] * filter[4] +
                            newImageData.data[(i*newWidth+j+1)*4] * filter[5] + newImageData.data[((i+1)*newWidth+j-1)*4] * filter[6] +
                            newImageData.data[((i+1)*newWidth+j)*4] * filter[7] + newImageData.data[((i+1)*newWidth+j+1)*4] * filter[8] ;

                        newImageData.data[index+1] = newImageData.data[((i-1)*newWidth+j-1)*4+1] * filter[0] +
                            newImageData.data[((i-1)*newWidth+j)*4+1] * filter[1] + newImageData.data[((i-1)*newWidth+j+1)*4+1] * filter[2] +
                            newImageData.data[(i*newWidth+j-1)*4+1] * filter[3] + newImageData.data[(i*newWidth+j)*4+1] * filter[4] +
                            newImageData.data[(i*newWidth+j+1)*4+1] * filter[5] + newImageData.data[((i+1)*newWidth+j-1)*4+1] * filter[6] +
                            newImageData.data[((i+1)*newWidth+j)*4+1] * filter[7] + newImageData.data[((i+1)*newWidth+j+1)*4+1] * filter[8] ;

                        newImageData.data[index+2] = newImageData.data[((i-1)*newWidth+j-1)*4+2] * filter[0] +
                            newImageData.data[((i-1)*newWidth+j)*4+2] * filter[1] + newImageData.data[((i-1)*newWidth+j+1)*4+2] * filter[2] +
                            newImageData.data[(i*newWidth+j-1)*4+2] * filter[3] + newImageData.data[(i*newWidth+j)*4+2] * filter[4] +
                            newImageData.data[(i*newWidth+j+1)*4+2] * filter[5] + newImageData.data[((i+1)*newWidth+j-1)*4+2] * filter[6] +
                            newImageData.data[((i+1)*newWidth+j)*4+2] * filter[7] + newImageData.data[((i+1)*newWidth+j+1)*4+2] * filter[8] ;
                    }
                }

                canvas.width = newWidth;
                canvas.height = newHeight;
                return newImageData;
            },
            showImage: function(imageData) {
                var ctx = canvasCTR.el[0].getContext("2d") ;

                ctx.putImageData(imageData, 0, 0) ;
            },
            processImage: function() {
                var targetGrayLevel = this.elements[0].val();
                var typeOfFilter = this.elements[1].val();
                var canvas = canvasCTR.el[0];
                var imageData;

                if( targetGrayLevel !== "" ) {
                    imageData = this.ReduceToGrayLevelSolution(canvas, targetGrayLevel);
                    this.showImage(imageData);
                }

                if( typeOfFilter !== "" ) {
                    imageData = this.calculateConvolution(canvas, this.filters[typeOfFilter]);
                    this.showImage(imageData);
                }
            }
        }).init();

        imageProcessorCTR.bind("init", function() {
            $("#slideUpImagePanel").bind("click", function() {
                imageProcessorCTR.hideImagePanel();
            });
            $("#slideUpImagePanel").hover(function() {
                $(this).css({"background":"#ee88cc"});
            }, function() {
                $(this).css({"background":"#990066"});
                $(this).css({"background":"#990066"});
            });

            this.el.bind("click", function() {
                imageProcessorCTR.showImagePanel();
            });

            $("#process").bind("click", function() {
                imageProcessorCTR.processImage();
            });
        });
        imageProcessorCTR.trigger("init");

        Export.imageProcessorCTR = imageProcessorCTR ;
    })(window);
});