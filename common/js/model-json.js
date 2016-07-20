/* Model
 *
 * Model for JSON data 
 */

(function(exports) {
    "use strict";

    // the model for the Media Sample Data
    // {Object} appSettings are the user-defined settings from the index page
    function JSONMediaModel(appSettings) {
        // mixin inheritance, initialize this as an event handler for these events:
        Events.call(this, ['error']);

        // this.mediaData = [];
        this.categoryData = []; // Holds all the TV program TITLES (ScienceTV, NatureTV, etc...)
        this.currSubCategory = [];
        this.currData = [];
        this.currentCategory = 0;
        this.currentItem = 0;
        this.defaultTheme = "default";
        this.currentlySearchData = false;

        this.collectionFolder = []; //Holds all the TV program OBJECTS (8)
        this.mediaFolder = []; //Holds responseData with seriesList and episodeList

        //timeout default to 1 min
        this.TIMEOUT = 60000;

        /**
         * This function loads the initial data needed to start the app and calls the provided callback with the data when it is fully loaded
         * @param {function} the callback function to call with the loaded data
         */
        this.loadTestData = function(dataLoadedCallback) {
            var requestData = {
                url: appSettings.dataURL,
                type: 'GET',
                crossDomain: true,
                dataType: 'json',
                context: this,
                cache: true,
                timeout: this.TIMEOUT,
                success: function() {
                    var contentData = arguments[0];
                    this.handleJsonData(contentData);
                    dataLoadedCallback();
                }.bind(this),
                error: function(jqXHR, textStatus) {
                    if (jqXHR.status === 0) {
                        this.trigger("error", ErrorTypes.INITIAL_NETWORK_ERROR, errorHandler.genStack());
                        return;
                    }
                    switch (textStatus) {
                        case "timeout":
                            this.trigger("error", ErrorTypes.INITIAL_FEED_TIMEOUT, errorHandler.genStack());
                            break;
                        case "parsererror":
                            this.trigger("error", ErrorTypes.INITIAL_PARSING_ERROR, errorHandler.genStack());
                            break;
                        default:
                            this.trigger("error", ErrorTypes.INITIAL_FEED_ERROR, errorHandler.genStack());
                            break;
                    }
                }.bind(this)
            };
            utils.ajaxWithRetry(requestData);
        }.bind(this);

        this.loadCollections = function(dataLoadedCallback) {
            // var queue = [];
            // for(var i = 0; i < this.count; i++) {
            //     queue.push("https://cms.xivetv.com/api/v3/collection/" + this.collectionListArray[i].collectionId);
            // }

            var queue = [ //Holds the URL's for the ajax calls
                appSettings.collection1,
                appSettings.collection2,
                appSettings.collection3,
                appSettings.collection4,
                appSettings.collection5,
                appSettings.collection6,
                appSettings.collection7,
                appSettings.collection8
            ];

            var promises = []; //Will hold all the ajax calls
            for (var i = 0; i < queue.length; i++) {
                promises.push($.ajax({
                    url: queue[i],
                    type: 'GET',
                    crossDomain: true,
                    dataType: 'json',
                    context: this,
                    cache: true,
                    timeout: this.TIMEOUT,
                    success: function() {
                        this.handleCollections(arguments[0]);
                    }.bind(this),
                    error: function(jqXHR, textStatus) {
                        if (jqXHR.status === 0) {
                            this.trigger("error", ErrorTypes.INITIAL_NETWORK_ERROR, errorHandler.genStack());
                            return;
                        }
                        switch (textStatus) {
                            case "timeout":
                                this.trigger("error", ErrorTypes.INITIAL_FEED_TIMEOUT, errorHandler.genStack());
                                break;
                            case "parsererror":
                                this.trigger("error", ErrorTypes.INITIAL_PARSING_ERROR, errorHandler.genStack());
                                break;
                            default:
                                this.trigger("error", ErrorTypes.INITIAL_FEED_ERROR, errorHandler.genStack());
                                break;
                        }
                    }.bind(this)
                }));
            }
            $.when.apply($, promises).then(function() {
                console.log("All Collection Details Loaded");
                dataLoadedCallback();
            });
        }.bind(this);

        // this.loadVideos = function() {
        //     // Add based on series/episode lists
        //     // var queue = [];
        //     // for(var i = 0; i < this.count; i++) {
        //     //     queue.push("https://cms.xivetv.com/api/v3/collection/" + this.collectionListArray[i].collectionId);
        //     // }

        //     var queue = [ //Holds the URL's for the ajax calls
        //         appSettings.video
        //     ];

        //     var promises = []; //Will hold all the ajax calls
        //     for (var i = 0; i < queue.length; i++) {
        //         promises.push($.ajax({
        //             url: queue[i],
        //             type: 'GET',
        //             crossDomain: true,
        //             dataType: 'json',
        //             context: this,
        //             cache: true,
        //             timeout: this.TIMEOUT,
        //             success: function() {
        //                 // dataLoadedCallback();
        //                 this.handleVideoData(arguments[0]);
        //                 // console.log(arguments[0].responseData.title + " Loaded");
        //             }.bind(this),
        //             error: function(jqXHR, textStatus) {
        //                 if (jqXHR.status === 0) {
        //                     this.trigger("error", ErrorTypes.INITIAL_NETWORK_ERROR, errorHandler.genStack());
        //                     return;
        //                 }
        //                 switch (textStatus) {
        //                     case "timeout":
        //                         this.trigger("error", ErrorTypes.INITIAL_FEED_TIMEOUT, errorHandler.genStack());
        //                         break;
        //                     case "parsererror":
        //                         this.trigger("error", ErrorTypes.INITIAL_PARSING_ERROR, errorHandler.genStack());
        //                         break;
        //                     default:
        //                         this.trigger("error", ErrorTypes.INITIAL_FEED_ERROR, errorHandler.genStack());
        //                         break;
        //                 }
        //             }.bind(this)
        //         }));
        //     }
        //     $.when.apply($, promises).then(function() {
        //         console.log("All Videos Loaded");
        //     });
        // }

        /**
         * Handles requests that contain json data
         * @param {Object} collectionDetails data returned from request
         */
        this.handleCollections = function(collectionDetails) {
            this.collectionFolder.push(collectionDetails.responseData);
            // create left nav based on the folder stucture object
            this.categoryData.push(collectionDetails.responseData.title);
        }

        // this.handleVideoData = function(videoData) {
        //     this.mediaData = videoData.responseData;
        // }

        /***************************
         *
         * Utility Methods
         *
         ***************************/
        /**
         * Sort the data array
         */
        this.sort_by = function(field, reverse, primer) {

            var key = primer ?
                function(x) {
                    return primer(x[field])
                } :
                function(x) {
                    return x[field]
                };

            reverse = !reverse ? 1 : -1;

            return function(a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            }
        };

        /***************************
         *
         * Media Data Methods
         *
         ***************************/
        /**
         * For single views just send the whole media object
         */
        // this.getAllMedia = function() {
        //     return mediaData;
        // };

        /***************************
         *
         * Category Methods
         *
         ***************************/
        /**
         * Hang onto the index of the currently selected category
         * @param {Number} index the index into the categories array
         */
        this.setCurrentCategory = function(index) {
            this.currentCategory = index;
        };

        /**
         * Function to set the current subcategory object, this be used to return the subcategory resuts in the getSubCategory method
         * which can be modified in the model before being returned asynchrounously if the model wishes.
         * @param {Object} data currently selected subcategory object
         */
        this.setCurrentSubCategory = function(data) {
            this.currSubCategory = data;
        };

        /***************************
         *
         * Content Item Methods
         *
         ***************************/
        /**
         * Return the category items for the left-nav view
         */
        this.getCategoryItems = function() {
            return this.categoryData;
        };

        /** 
         * Get and return data for a selected category
         * @param {Function} categoryCallback method to call with returned requested data
         */
        this.getCategoryData = function(categoryCallback) {
            var currCat;
            this.currData = [];

            currCat = this.collectionFolder[this.currentCategory];
            this.currData = this.getFullContentsForFolder(currCat);
            categoryCallback(this.currData);
        };

        /** 
         * Get and return full contents objects for a given folder
         * @param {object} folder object to find contents for
         */
        this.getFullContentsForFolder = function(folder) {
            var contents = [];
            if (folder.hasOwnProperty("collectionId")) {
                var currSeriesContents = folder.seriesList,
                    currEpiContents = folder.episodeList;

                for (var i = 0; i < folder.seriesList.length; i++) {
                    folder.seriesList[i].type = "subcategory";
                    contents.push(folder.seriesList[i]);
                }
                for (var i = 0; i < folder.episodeList.length; i++) {
                    contents.push(folder.episodeList[i]);
                }
                console.log("Collection Selected");
            } else if (folder.hasOwnProperty("seriesId")) {
                for (var i = 0; i < folder.episodeList.length; i++) {
                    contents.push(folder.episodeList[i]);
                }
                console.log("Series Selected");
            } // else if(folder.hasOwnProperty("videoId")) {

            // }

            return contents.sort(this.sort_by("order", false, parseInt));
        };

        /** 
         * Get and return data for a selected sub category, modified however the model wishes. Uses an asynchrounous callback to return the data.
         * @param {Function} subCategoryCallback method to call with returned requested data
         */
        this.getSubCategoryData = function(subCategoryCallback) {
            // clone the original object
            var returnData = JSON.parse(JSON.stringify(this.currSubCategory));
            returnData.contents = this.getFullContentsForFolder(this.currSubCategory);
            subCategoryCallback(returnData);
        };

        /**
         * Get and return data for a search term
         * @param {string} searchTerm to search for
         * @param {Function} searchCallback method to call with returned requested data
         */
        this.getDataFromSearch = function(searchTerm, searchCallback) {
            this.currData = [];
            for (var i = 0; i < this.collectionFolder.length; i++) {
                if (this.collectionFolder[i].title.toLowerCase().indexOf(searchTerm) >= 0 ||
                    this.collectionFolder[i].uniqueDescription.toLowerCase().indexOf(searchTerm) >= 0) {
                    this.currData.push(this.collectionFolder[i]);
                }
            }
            for (var i = 0; i < this.seriesFolder.length; i++) {
                if (this.seriesFolder[i].title.toLowerCase().indexOf(searchTerm) >= 0 ||
                    this.seriesFolder[i].uniqueDescription.toLowerCase().indexOf(searchTerm) >= 0) {
                    this.currData.push(this.collectionFolder[i]);
                }
            }
            for (var i = 0; i < this.mediaFolder.length; i++) {
                if (this.mediaFolder[i].title.toLowerCase().indexOf(searchTerm) >= 0 ||
                    this.mediaFolder[i].uniqueDescription.toLowerCase().indexOf(searchTerm) >= 0) {
                    this.currData.push(this.collectionFolder[i]);
                }
            }
            searchCallback(this.currData);
        };

        /**
         * Store the refrerence to the currently selected content item
         * @param {Number} index the index of the selected item
         */
        this.setCurrentItem = function(index) {
            this.currentItem = index;
            this.currentItemData = this.currData[index];
        };

        /**
         * Retrieve the reference to the currently selected content item
         */
        this.getCurrentItemData = function() {
            return this.currentItemData;
        };

    }

    exports.JSONMediaModel = JSONMediaModel;

})(window);