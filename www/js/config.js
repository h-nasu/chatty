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


      // Push Notifocation Setup
      
      var localPushToken = JSON.parse(localStorage.getItem('_raix:push_token'));

      if (!localPushToken) {
        var interPush = setInterval(function(){
          if (typeof PushNotification !== 'undefined') {
            clearInterval(interPush);
            Push.Configure({
              gcm: {
                // Required for Android and Chrome OS
                projectNumber: '482046828327'
              },
              bagde: true,
              sound: true,
              alert: true
            });
          }
        }, 300);
      }

      Push.addListener('error', function(err) {
        console.log(err);
      });

      Push.addListener('token', function(token) {
          // Token is { apn: 'xxxx' } or { gcm: 'xxxx' }
          //console.log('token');
          //console.log(token);
      });

      Push.addListener('register', function(evt) {
          // Platform specific event - not really used
          //console.log('reg');
          //console.log(evt);
      });

      Push.addListener('alert', function(notification) {
          // Called when message got a message in forground
          //console.log('alert');
          //console.log(notification);
      });



    }

  });
}
