angular.module('app')
.controller('LoginCtrl', function($scope, usersService, $rootScope, $location) {
  $('.alert .close').on('click', function (e) {
    $(this).parent().hide();
  });

  $scope.login = {
    username: '',
    password: ''
  };

  $scope.submit = function(isValid) {
    if (isValid) {
      usersService.login($scope.login.username, $scope.login.password, res => {
        if (res.status === 401) {
          $('#login-error').show();
        } else {
          $rootScope.userId = res.data.user_id;
          console.log('rootScopUserID:', $rootScope.userId);
          $rootScope.hackcoin = res.data.hackcoin;
          $scope.login = {
            username: '',
            password: ''
          };
          $('#login-modal').modal('toggle');
          $location.path('/');
        }
      });
    }
  };
});
