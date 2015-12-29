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
