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
