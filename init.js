
(function(exports) {
    'use strict';

    //initialize the app
    var settings = {
        Model: JSONMediaModel,
        PlayerView: PlayerView,
        dataURL: "https://cms.xivetv.com/api/v3/collection",
        showSearch: false,
        displayButtons: false
    };

    exports.app = new App(settings);
}(window));