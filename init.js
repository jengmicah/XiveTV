// var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": "https://cms.xivetv.com/api/v3/collection/41",
//     "method": "GET",
//     "headers": {
//         "authorization": "eyJhdXRoVG9rZW4iOiIiLCJwYXNzd29yZCI6IiIsImF1dGhrZXkiOjEyMzQ1Njc4OSwidXNlcklkIjoiIn0",
//     }
// }

// $.ajax(settings).done(function(response) {
//     console.log(response);
// });

(function(exports) {
    'use strict';

    //initialize the app
    var settings = {
        Model: JSONMediaModel,
        PlayerView: PlayerView,
        // PlaylistView: PlaylistPlayerView,
        dataURL: "./assets/genericSubCategoriesData.json",
        collection1: "./assets/1_details.json", // Everything from here down is static test data
        collection2: "./assets/2_details.json",
        collection3: "./assets/3_details.json",
        collection4: "./assets/4_details.json",
        collection5: "./assets/5_details.json",
        collection6: "./assets/6_details.json",
        collection7: "./assets/7_details.json",
        collection8: "./assets/8_details.json",
        video: "./assets/video.json", // Will call for the video when setting up left-nav?
        showSearch: false,
        displayButtons: false
    };

    exports.app = new App(settings);
}(window));