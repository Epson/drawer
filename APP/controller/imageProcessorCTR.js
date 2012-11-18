/**
 *
 */
jQuery(function(){
    (function(Export){
        var imageProcessorCTR = Spine.Controller.create({
            name: "imageProcessorCTR",
            el: $("#imageProcessor"),
            panel: $("#ImagePanel"),
            elements: [$("#grayLevel"), $("#typeOfFilter")],
            filtersProcessor: null,
            init: function() {
                this.filtersProcessor = {
                    averageFilter: function(data, index, width, sizeOfFilter) {
                        var range = Math.floor(sizeOfFilter / 2);
                        var result = 0;
                        for( var i = -range; i <= range; i ++ ) {
                            for( var j = -range; j <= range; j ++ ) {
                                result = result + data[index + (i * width + j) * 4] * 0.111;
                            }
                        }
                        return result;
                    },
                    minimalFilter: function(data, index, width, sizeOfFilter) {
                        var range = Math.floor(sizeOfFilter / 2);
                        var min = 9999999;
                        for( var i = -range; i <= range; i ++ ) {
                            for( var j = -range; j <= range; j ++ ) {
                                min = data[index + (i * width + j) * 4] < min ? data[index + (i * width + j) * 4] : min;
                            }
                        }
                        return min;
                    },
                    midValueFilter: function(data, index, width, sizeOfFilter) {
                        var range = Math.floor(sizeOfFilter / 2);
                        var array = [];
                        for( var i = -range; i <= range; i ++ ) {
                            for( var j = -range; j <= range; j ++ ) {
                                array.push(data[index + (i * width + j) * 4]);
                            }
                        }

                        var algorithm = new Algorithm();
                        algorithm.quickSort(array, 0, array.length - 1);

                        return array[Math.floor(array.length / 2)];
                    },
                    maximalFilter: function(data, index, width, sizeOfFilter) {
                        var range = Math.floor(sizeOfFilter / 2);
                        var max = 0;
                        for( var i = -range; i <= range; i ++ ) {
                            for( var j = -range; j <= range; j ++ ) {
                                max = data[index + (i * width + j) * 4] > max ? data[index + (i * width + j) * 4] : max;
                            }
                        }
                        return max;
                    },
                    laplacianFilter: function(data, index, width, sizeOfFilter) {
                        var range = Math.floor(sizeOfFilter / 2);
                        var result = 0;
                        var indexOfFilter = 0;
                        var filter = [  1, 1, 1,
                                        1, -8, 1,
                                        1, 1, 1     ];

                        for( var i = -range; i <= range; i ++ ) {
                            for( var j = -range; j <= range; j ++ ) {
                                result = result + data[index + (i * width + j) * 4] * filter[indexOfFilter];
                                indexOfFilter ++;
                            }
                        }

                        result = data[index] - result;
                        return result;
                    }
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
            calculateConvolution: function(canvas, filterType, sizeOfFilter) {
                var width = canvas.width;
                var height = canvas.height;
                var ctx = canvas.getContext("2d");
                var inputData = ctx.getImageData(0, 0, width, height).data;
                var newImageData;
                var minValue = 999999;
                var dataArray = [];

                //padding
                var newWidth = width + 2 * ( sizeOfFilter - 1 );
                var newHeight = height + 2 * ( sizeOfFilter - 1 );
                var indexOfSrcData = 0;
                newImageData = ctx.createImageData(newWidth, newHeight);
                for( var i = 0; i < sizeOfFilter - 1; i ++ ) {
                    for( var j = 0 ; j < newWidth; j ++ ) {
                        var index = (i * newWidth + j) * 4;
                        dataArray[index] = 0;
                        dataArray[index+1] = 0;
                        dataArray[index+2] = 0;
                        dataArray[index+3] = 255;
                        newImageData.data[index] = 0;
                        newImageData.data[index+1] = 0;
                        newImageData.data[index+2] = 0;
                        newImageData.data[index+3] = 255;
                    }
                }
                for( var i = sizeOfFilter - 1; i < height + sizeOfFilter - 1; i ++ ) {
                    for( var j = 0; j < sizeOfFilter - 1; j ++ ) {
                        var index = (i * newWidth + j) * 4;
                        dataArray[index] = 0;
                        dataArray[index+1] = 0;
                        dataArray[index+2] = 0;
                        dataArray[index+3] = 255;
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
                        dataArray[index] = 0;
                        dataArray[index+1] = 0;
                        dataArray[index+2] = 0;
                        dataArray[index+3] = 255;
                        newImageData.data[index] = 0;
                        newImageData.data[index+1] = 0;
                        newImageData.data[index+2] = 0;
                        newImageData.data[index+3] = 255;
                    }
                }
                for( var i = height + sizeOfFilter - 1; i < height + 2 * (sizeOfFilter - 1); i ++ ) {
                    for( var j = 0 ; j < newWidth; j ++ ) {
                        var index = (i * newWidth + j) * 4;
                        dataArray[index] = 0;
                        dataArray[index+1] = 0;
                        dataArray[index+2] = 0;
                        dataArray[index+3] = 255;
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
                        dataArray[index] = this.filtersProcessor[filterType](newImageData.data, index, newWidth, sizeOfFilter);
                        dataArray[index+1] = this.filtersProcessor[filterType](newImageData.data, index+1, newWidth, sizeOfFilter);
                        dataArray[index+2] = this.filtersProcessor[filterType](newImageData.data, index+2, newWidth, sizeOfFilter);
                        minValue = dataArray[index] < minValue ? dataArray[index] : minValue;
                        minValue = dataArray[index+1] < minValue ? dataArray[index+1] : minValue;
                        minValue = dataArray[index+2] < minValue ? dataArray[index+2] : minValue;
                    }
                }

                this.demarcate(dataArray, minValue);

                for( var i = sizeOfFilter - 1; i < newHeight - ( sizeOfFilter - 1 ); i ++ ) {
                    for( var j = sizeOfFilter - 1; j < newWidth - ( sizeOfFilter - 1 ); j ++ ) {
                        var index = (i * newWidth + j) * 4;
                        newImageData.data[index] = dataArray[index];
                        newImageData.data[index+1] = dataArray[index+1];
                        newImageData.data[index+2] = dataArray[index+2];
                    }
                }

                return newImageData;
            },
            demarcate : function(data, minValue) {
                var length = data.length;
                var maxInterval = 0;

                for( var i = 0; i < length; i ++ ) {
                    if( maxInterval < data[i] - minValue && (i + 1) % 4 !== 0 ) {
                        maxInterval = data[i] - minValue;
                    }
                }

//                for( var i = 0; i < length; i ++ ) {
//                    if( maxInterval < data[i] - minValue && (i + 1) % 4 !== 0 ) {
//                        data[i] = parseInt( 255 * ( (data[i] - minValue) / maxInterval ) );
//                    }
//                }
            },
            showImage: function(imageData, x, y) {
                x = x || 0;
                y = y || 0;

                var ctx = canvasCTR.el[0].getContext("2d") ;
                ctx.putImageData(imageData, x, y) ;
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
                    var sizeOfFilter = Math.sqrt( 9 );
                    imageData = this.calculateConvolution(canvas, typeOfFilter, sizeOfFilter);
                    this.showImage(imageData, -sizeOfFilter+1, -sizeOfFilter+1);
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