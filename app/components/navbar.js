angular.module('app')
.controller('NavbarCtrl', function($scope, $rootScope, $location, usersService) {
  $scope.logout = function() {
    usersService.logout();
    $rootScope.userId = 0;
    $location.path('/');
  };
  $scope.yourUserPage = function() {
    console.log('got to your userpage', $rootScope.userId);
    $rootScope.userPageUser = $rootScope.userId;
    $location.path('/self');
  };
})
.directive('navbar', function() {
  return {
    templateUrl: 'templates/navbar.html',
    controller: 'NavbarCtrl'
  };
});
