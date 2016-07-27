
(function(exports) {
    'use strict';

    //initialize the app
    var settings = {
        Model: JSONMediaModel,
        PlayerView: PlayerView,
        // PlaylistView: PlaylistPlayerView,
        dataURL: "https://cms.xivetv.com/api/v3/collection",
        video: "./assets/video.json",
        showSearch: false,
        displayButtons: false
    };

    exports.app = new App(settings);
}(window));