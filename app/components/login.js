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
        if (res.status === 401 && res.data === 'username does not exist') {
          $('#login-error-exists').show();
          $('#login-error-password').hide();                 
        } else if (res.status === 401 && res.data === 'false password') {
          $('#login-error-password').show();
          $('#login-error-exists').hide();          
        } else {
          $rootScope.userId = res.data.user_id;
          console.log('rootScopUserID:', $rootScope.userId);
          $rootScope.hackcoin = res.data.hackcoin;
          $rootScope.questcoin = res.data.questcoin;
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
