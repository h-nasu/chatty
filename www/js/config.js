angular
  .module('chatty')
  .run(ionicPlat);

function ionicPlat ($rootScope, $ionicPlatform) {
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
    if (ionic.Platform.isWebView()) {
      var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
      deviceInfo.get(function(result) {
        $rootScope.deviceInfo = JSON.parse(result);
        // phone numbber
        // $rootScope.deviceInfo.phoneNo

      }, function() {
         console.log("error");
      });
    }

  });
}
