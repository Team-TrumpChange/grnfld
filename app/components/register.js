angular.module('app')
.controller('RegisterCtrl', function ($scope, usersService, $rootScope, $location) {
  $('.alert .close').on('click', function (e) {
    $(this).parent().hide();
  });

  $scope.register = {
    username: '',
    password: '',
    confirmpassword: '',
    email: '',
    skills: ''
  };

  $scope.submit = function (isValid) {
    if (isValid) {
      usersService.register($scope.register.username, $scope.register.password, $scope.register.email, $scope.register.skills, res => {
        console.log(res.data);
        if (res.status === 409 && res.data === 'username already exists') {
          $('#reg-error-user').show();
          $('#reg-error-email').hide();          
        } else if (res.status === 409 && res.data === 'email already exists') {
          $('#reg-error-email').show();
          $('#reg-error-user').hide();
        } else {
          console.log('userid', res.data.user_id);
          $rootScope.userId = res.data.user_id;
          $rootScope.hackcoin = res.data.hackcoin;
          $rootScope.questcoin = res.data.questcoin;
          $scope.register = {
            username: '',
            password: '',
            email: '',
            skills: ''
          };
          $('#register-modal').modal('toggle');
          $location.path('/');
        }
      });
    }
  };
});
