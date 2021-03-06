angular.module('app')
  .controller('AppCtrl', function (postsService, usersService, $rootScope) {
  $rootScope.userId = 0;
  $rootScope.hackcoin = 0;
  $rootScope.questcoin = 0;
  $rootScope.userPageUser = 0;
})
.component('app', {
  bindings: {},
  controller: 'AppCtrl',
  templateUrl: 'templates/app.html'
})
.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
    })
    .when('/submit', {
      templateUrl: 'templates/submit.html',
      controller: 'SubmitCtrl'
    })
    .when('/user', {
      templateUrl: 'templates/user.html',
      controller: 'UserCtrl'
    })
    .when('/self', {
      templateUrl: 'templates/user.html',
      controller: 'UserCtrl'
    })
    .otherwise({ redirectTo: '/' });
  $locationProvider.html5Mode(true);
});
