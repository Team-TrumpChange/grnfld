angular.module('app')
.controller('NavbarCtrl', function($scope, $rootScope, $location, usersService) {
  $scope.logout = function() {
    usersService.logout();
    $rootScope.userId = 0;
    $location.path('/');
  };
})
.directive('navbar', function() {
  return {
    templateUrl: 'templates/navbar.html',
    controller: 'NavbarCtrl'
  };
});
