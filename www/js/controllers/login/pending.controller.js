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
