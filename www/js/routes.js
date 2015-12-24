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
