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
