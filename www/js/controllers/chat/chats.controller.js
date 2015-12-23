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
