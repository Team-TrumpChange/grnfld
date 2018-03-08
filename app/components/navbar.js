angular.module('app')
.controller('NavbarCtrl', function($scope, $rootScope, $location, usersService) {
  $scope.logout = function() {
    usersService.logout();
    $rootScope.userId = 0;
    $location.path('/');
  };
  $scope.yourUserPage = function() {
    console.log('got ot your userpage', $rootScope.userId);
    $rootScope.userPageUser = $rootScope.userId;
    $location.path('/user');
  };
})
.directive('navbar', function() {
  return {
    templateUrl: 'templates/navbar.html',
    controller: 'NavbarCtrl'
  };
});
