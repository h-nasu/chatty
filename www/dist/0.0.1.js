var test;

angular
  .module('chatty', [
    'ionic',
    'angular-meteor',
    'angularMoment',
    'chattyTemplates'
  ]);

angular
  .module('chatty')
  .run(authReq);

function authReq ($rootScope, $state) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === 'AUTH_REQUIRED') {
      $state.go('login');
    }
  });
}


Chats = new Mongo.Collection('chats');
Messages = new Mongo.Collection('messages');

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

angular
  .module('chatty')
  .config(initRoute);

function initRoute ($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'js/templates/tabs.html',
    resolve: {
      user: ['$meteor', function ($meteor) {
        return $meteor.requireUser();
      }],
      chats: ['$meteor', function ($meteor) {
        return $meteor.subscribe('chats');
      }]
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/chats');
}

Meteor.methods({
  newChat: function (otherId) {
    check(otherId, String);

    var otherUser = Meteor.users.findOne(otherId);
    if (! otherUser) {
      throw Meteor.Error('user-not-exists', 'Chat\'s user not exists');
    }

    var chat = {
      userIds: [this.userId, otherId],
      createdAt: new Date()
    };

    return Chats.insert(chat);
  },

  removeChat: function (chatId) {
    check(chatId, String);

    Messages.remove({ chatId: chatId });
    return Chats.remove({ _id: chatId });
  },

  newMessage: function (message) {
    check(message, {
      text: String,
      chatId: String
    });

    message.timestamp = new Date();
    message.userId = this.userId;

    var messageId = Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });
    return messageId;
  }
});

angular
  .module('chatty')
  .filter('calendar', calendar);

function calendar () {
  return function (time) {
    if (! time) return;

    return moment(time).calendar(null, {
      lastDay : '[Yesterday]',
      sameDay : 'LT',
      lastWeek : 'dddd',
      sameElse : 'DD/MM/YY'
    });
  }
}

angular
  .module('chatty')
  .filter('chatName', chatName);

function chatName () {
  return function (chat) {
    if (!chat) return;

    var otherId = _.without(chat.userIds, Meteor.userId())[0];
    var otherUser = Meteor.users.findOne(otherId);
    var hasName = otherUser && otherUser.profile && otherUser.profile.name;

    return hasName ? otherUser.profile.name : 'PLACE HOLDER';
  }
}

angular
  .module('chatty')
  .filter('chatPicture', chatPicture);

function chatPicture () {
  return function (chat) {
    if (!chat) return;

    var otherId = _.without(chat.userIds, Meteor.userId())[0];
    var otherUser = Meteor.users.findOne(otherId);
    var hasPicture = otherUser && otherUser.profile && otherUser.profile.picture;

    return hasPicture ? otherUser.profile.picture : '/img/user-default.svg';
  }
}

angular
  .module('chatty')
  .directive('input', input);

// The directive enable sending message when tapping return
// and expose the focus and blur events to adjust the view
// when the keyboard opens and closes
function input ($timeout) {
  var directive =  {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: link
  };
  return directive;

  ////////////

  function link (scope, element, attrs) {
    element.bind('focus', function (e) {
      if (scope.onFocus) {
        $timeout(function () {
          scope.onFocus();
        });
      }
    });

    element.bind('blur', function (e) {
      if (scope.onBlur) {
        $timeout(function () {
          scope.onBlur();
        });
      }
    });

    element.bind('keydown', function (e) {
      if (e.which == 13) {
        if (scope.returnClose) {
          element[0].blur();
        }

        if (scope.onReturn) {
          $timeout(function () {
            scope.onReturn();
          });
        }
      }
    });
  }
}

angular
  .module('chatty')
  .config(ChatDetailConfig)
  .controller('ChatDetailCtrl', ChatDetailCtrl);

function ChatDetailConfig ($stateProvider) {
  $stateProvider
  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'js/controllers/chat/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })
  ;
}

function ChatDetailCtrl ($scope, $stateParams, $timeout, $meteor, $ionicScrollDelegate) {
  var chatId = $stateParams.chatId;
  var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  $scope.chat = $scope.$meteorObject(Chats, chatId, false);
  $scope.messages = $scope.$meteorCollection(function () {
    return Messages.find({ chatId: chatId });
  }, false);
  $scope.data = {};

  $scope.$watchCollection('messages', function (oldVal, newVal) {
    var animate = oldVal.length !== newVal.length;
    $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
  });

  $scope.sendMessage = sendMessage;
  $scope.inputUp = inputUp;
  $scope.inputDown = inputDown;
  $scope.closeKeyboard = closeKeyboard;

  ////////////

  function sendMessage () {
    if (_.isEmpty($scope.data.message)) {
      return;
    }

    $meteor.call('newMessage', {
      text: $scope.data.message,
      chatId: chatId
    });

    delete $scope.data.message;
  }

  function inputUp () {
    if (isIOS) {
      $scope.data.keyboardHeight = 216;
    }

    $timeout(function() {
      $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
    }, 300);
  }

  function inputDown () {
    if (isIOS) {
      $scope.data.keyboardHeight = 0;
    }

    $ionicScrollDelegate.$getByHandle('chatScroll').resize();
  }

  function closeKeyboard () {
    // cordova.plugins.Keyboard.close();
  }
}

angular
  .module('chatty')
  .config(ChatsConfig)
  .controller('ChatsCtrl', ChatsCtrl);

function ChatsConfig ($stateProvider) {
  $stateProvider
  .state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'js/controllers/chat/tab-chats.html',
        controller: 'ChatsCtrl'
      }
    }
  })
  ;
}

function ChatsCtrl ($scope, $meteor, $ionicModal) {
  $scope.chats = $scope.$meteorCollection(Chats, false);

  $ionicModal.fromTemplateUrl('js/controllers/chat/new-chat.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });

  $scope.openNewChatModal = openNewChatModal;
  $scope.remove = remove;

  ////////////

  function openNewChatModal () {
    $scope.modal.show();
  }

  function remove (chat) {
    $meteor.call('removeChat', chat._id);
  }
}

angular
  .module('chatty')
  .controller('NewChatCtrl', NewChatCtrl);

function NewChatCtrl ($scope, $state, $meteor) {
  $scope.$meteorSubscribe('users').then(function () {
    $scope.users = $scope.$meteorCollection(function () {
      return Meteor.users.find({ _id: { $ne: Meteor.userId() } });
    }, false);
  });

  $scope.hideModal = hideModal;
  $scope.newChat = newChat;

  ////////////

  function hideModal () {
    $scope.modal.hide();
  }

  function newChat (userId) {
    //var chat = Chats.findOne({ type: 'chat', userIds: { $all: [Meteor.userId(), userId] } });
    var chat = Chats.findOne({ userIds: { $all: [Meteor.userId(), userId] } });
    if (chat) {
      return goToChat(chat._id);
    }

    $meteor.call('newChat', userId).then(goToChat);
  }

  function goToChat (chatId) {
    hideModal();
    return $state.go('tab.chat-detail', { chatId: chatId });
  }
}

angular
  .module('chatty')
  .config(ContactsConfig)
  .controller('ContactsCtrl', ContactsCtrl);

function ContactsConfig ($stateProvider) {
  $stateProvider
  .state('tab.contacts', {
    url: '/contacts',
    views: {
      'tab-contacts': {
        templateUrl: 'js/controllers/contact/tab-contacts.html',
        controller: 'ContactsCtrl'
      }
    }
  })
  ;
}

function ContactsCtrl ($scope, $meteor, $state, $ionicModal, $ionicPopup, $ionicLoading) {

  $scope.$meteorSubscribe('users').then(function () {
    $scope.users = $scope.$meteorCollection(function () {
      //return Meteor.users.find({ _id: { $ne: Meteor.userId() } });
      var me = Meteor.user();
      if (me && !me.admin) {
        return Meteor.users.find({_id: { $ne: Meteor.userId() }, activate:true});
      } else {
        return Meteor.users.find({ _id: { $ne: Meteor.userId() } });
      }
    }, false);
  });

  $scope.newChat = newChat;
  $scope.activate= activate;

  ////////////

  function newChat (user) {
    if (user.activate) {
      //var chat = Chats.findOne({ type: 'chat', userIds: { $all: [Meteor.userId(), user._id] } });
      var chat = Chats.findOne({ userIds: { $all: [Meteor.userId(), user._id] } });
      if (chat) {
        return goToChat(chat._id);
      }
      $meteor.call('newChat', user._id).then(goToChat);
    } else {
      activate(user);
    }
  }

  function goToChat (chatId) {
    //hideModal();
    return $state.go('tab.chat-detail', { chatId: chatId });
  }

  function activate(user) {
    //console.log(user);
    var confirmPopup = $ionicPopup.confirm({
      title: 'User Activation',
      template: '<div>Change activation for '+user.emails[0].address+'?</div>',
      cssClass: 'text-center',
      okText: 'Yes',
      okType: 'button-positive button-clear',
      cancelText: 'Cancel',
      cancelType: 'button-dark button-clear'
    });

    confirmPopup.then(function (res) {
      if (! res) {
        return;
      }

      $ionicLoading.show({
        template: 'Registering Info...'
      });

      $meteor.call('changeUserActivation', user._id)
        .then(function(result){
          $ionicLoading.hide();
        })
        .catch(handleError);
    });
  }

  function handleError (err) {
    $log.error('profile save error ', err);
    $ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}

angular
  .module('chatty')
  .config(ConfirmationConfig)
  .controller('ConfirmationCtrl', ConfirmationCtrl);

function ConfirmationConfig ($stateProvider) {
  $stateProvider
  .state('confirmation', {
    url: '/confirmation/:phone',
    templateUrl: 'js/controllers/login/confirmation.html',
    controller: 'ConfirmationCtrl'
  })
  ;
}

function ConfirmationCtrl ($scope, $state, $ionicPopup, $log) {

  $scope.phone = $state.params.phone;
  $scope.data = {};

  $scope.verify = verify;

  ////////////

  function verify () {
    if (_.isEmpty($scope.data.code)) {
      return;
    }

    Accounts.verifyPhone($scope.phone, $scope.data.code, function (err) {
      if (err) {
        return handleError(err);
      }

      $state.go('profile');
    });
  }

  function handleError (err) {
    $log.error('Verfication error ', err);

    $ionicPopup.alert({
      title: err.reason || 'Verfication failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
   });
  }
}

angular
  .module('chatty')
  .config(LoginConfig)
  .controller('LoginCtrl', LoginCtrl);

function LoginConfig ($stateProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'js/controllers/login/login.html',
    controller: 'LoginCtrl'
  })
  ;
}

function LoginCtrl ($rootScope, $scope, $meteor, $state, $ionicLoading, $ionicPopup, $log) {

  //$rootScope.deviceInfo = {phoneNo:90987689877};
  //$rootScope.deviceInfo = {phoneNo:101919101};
  if ($rootScope.deviceInfo && $rootScope.deviceInfo.phoneNo) {
    var cb = function(){
        $state.go('profile');
      };
    Accounts.callLoginMethod({
      methodArguments: [$rootScope.deviceInfo],
      userCallback: cb
    });
  }

  $scope.data = {};
  $scope.login = login;
  
  //$scope.data.email = 'fafa@fafa.com';
  //$scope.data.password = 'fafa';

  ////////////

  function login () {
    
    $ionicLoading.show({
      template: 'Logging In...'
    });

    $meteor.loginWithPassword($scope.data.email, $scope.data.password, function (err) {
      $ionicLoading.hide();

      if (err) {
        return handleError(err);
      }
      $state.go('profile');
    });
  }

  function handleError (err) {
    $log.error('Login error ', err);

    $ionicPopup.alert({
      title: err.reason || 'Login failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
   });
  }
}

angular
  .module('chatty')
  .config(PendingConfig)
  .controller('PendingCtrl', PendingCtrl);

function PendingConfig ($stateProvider) {
  $stateProvider
  .state('pending', {
    url: '/pending',
    templateUrl: 'js/controllers/login/pending.html',
    controller: 'PendingCtrl'
  })
  ;
}

function PendingCtrl ($rootScope, $scope, $state, $ionicLoading, $ionicPopup, $log) {


}

angular
  .module('chatty')
  .config(RegisterConfig)
  .controller('RegisterCtrl', RegisterCtrl);

function RegisterConfig ($stateProvider) {
  $stateProvider
  .state('register', {
    url: '/register',
    templateUrl: 'js/controllers/login/register.html',
    controller: 'RegisterCtrl'
  })
  ;
}

function RegisterCtrl ($rootScope, $scope, $state, $ionicLoading, $ionicPopup, $log) {

  $scope.data = {};
  $scope.data.profile = {};
  $scope.register = register;
  //$scope.data.profile.phone = $rootScope.deviceInfo.phoneNo;
  /*
  $scope.data.profile.phone = 90987689877;
  $scope.data.email = 'fafa@fafa.com';
  $scope.data.password = 'fafa';
  */

  /*
  $scope.data.profile.phone = 101919101;
  $scope.data.email = 'gaga@gaga.com';
  $scope.data.password = 'gaga';
  */

  /*
  $scope.data.profile.phone = 1111111;
  $scope.data.email = 'dada@dada.com';
  $scope.data.password = 'dada';
  */

  function register() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Registeration confirmation',
      template: '<div>Is your information correct?</div>',
      cssClass: 'text-center',
      okText: 'Yes',
      okType: 'button-positive button-clear',
      cancelText: 'edit',
      cancelType: 'button-dark button-clear'
    });

    confirmPopup.then(function (res) {
      if (! res) {
        return;
      }

      $ionicLoading.show({
        template: 'Registering Info...'
      });

      Accounts.createUser($scope.data, function (err) {
        $ionicLoading.hide();

        if (err) {
          return handleError(err);
        }

        $state.go('pending');
      });
    });
  }

  function handleError (err) {
    console.log(err);
    if (err.reason == 'Login forbidden') {
      $state.go('pending');
    } else {
      $log.error('Registeration error ', err);

      $ionicPopup.alert({
        title: err.reason || 'Registeration failed',
        template: 'Please try again',
        okType: 'button-positive button-clear'
      });
    }
  }

}

angular
  .module('chatty')
  .config(ProfileConfig)
  .controller('ProfileCtrl', ProfileCtrl);

function ProfileConfig ($stateProvider) {
  $stateProvider
  .state('profile', {
    url: '/profile',
    templateUrl: 'js/controllers/setting/profile.html',
    controller: 'ProfileCtrl',
    resolve: {
      user: ['$meteor', function ($meteor) {
        return $meteor.requireUser();
      }]
    }
  })
  ;
}

function ProfileCtrl ($scope, $state, $meteor, $ionicLoading, $ionicPopup, $log) {

  var user = Meteor.user();
  var name = user && user.profile ? user.profile.name : '';
  $scope.data = {
    name: name
  };

  $scope.updateName = updateName;

  ////////////

  function updateName () {
    if (_.isEmpty($scope.data.name)) {
      return;
    }

    $meteor.call('updateName', $scope.data.name)
      .then(function () {
        $state.go('tab.chats');
      })
      .catch(handleError);
  }

  function handleError (err) {
    $log.error('profile save error ', err);
    $ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}

angular
  .module('chatty')
  .config(SettingsConfig)
  .controller('SettingsCtrl', SettingsCtrl);

function SettingsConfig ($stateProvider) {
  $stateProvider
  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'js/controllers/setting/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })
  ;
}

function SettingsCtrl ($scope, $meteor, $state) {
  $scope.logout = logout;

  ////////////

  function logout () {
    $meteor.logout().then(function () {
      $state.go('login');
    });
  }
}
