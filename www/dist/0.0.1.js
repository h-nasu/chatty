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
    var chat = Chats.findOne({ type: 'chat', userIds: { $all: [Meteor.userId(), userId] } });
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

function LoginCtrl ($scope, $state, $ionicLoading, $ionicPopup, $log) {

  $scope.data = {};
  $scope.login = login;

  ////////////

  function login () {
    if (_.isEmpty($scope.data.phone)) {
      return;
    }

    var confirmPopup = $ionicPopup.confirm({
      title: 'Number confirmation',
      template: '<div>' + $scope.data.phone + '</div><div>Is your phone number above correct?</div>',
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
        template: 'Sending verification code...'
      });

      Accounts.requestPhoneVerification($scope.data.phone, function (err) {
        $ionicLoading.hide();

        if (err) {
          return handleError(err);
        }

        $state.go('confirmation', { phone: $scope.data.phone });
      });
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
