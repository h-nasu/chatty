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
