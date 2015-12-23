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
