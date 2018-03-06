angular.module('app')
.controller('NavbarCtrl', function($scope, $rootScope, $location) {
  $scope.logout = function() {
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
