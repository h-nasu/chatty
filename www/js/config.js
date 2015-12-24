angular
  .module('chatty')
  .run(ionicPlat);

function ionicPlat ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    // If not PC
    /*
    if (!_.isEmpty(ionic.Platform.device())) {
      //var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
      var deviceInfo = window.cordova.plugins.DeviceInformation;
      deviceInfo.get(function(result) {
        console.log("result = " + result);
      }, function() {
         console.log("error");
      });
    }
    */

  });
}
