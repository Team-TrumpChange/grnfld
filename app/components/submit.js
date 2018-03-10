angular.module('app')
.controller('SubmitCtrl', function($scope, postsService, $rootScope, $location) {
  
    $scope.submit = function(isValid) {
      if ($rootScope.questcoin === 0) {
         console.log('not enough coins')
         $('#submit-error').show();
      } else {
        if (isValid) {
          postsService.submitNewPost($scope.post, res => {
            if (res.status === 200) {
              $location.path('/');
            }
          });
        }
        $rootScope.questcoin--
      }
    };
  
  

  //create new post variable
  $scope.post = {
    userId: $rootScope.userId,
    title: '',
    codebox: '',
    description: '',
    questcoin: $rootScope.questcoin

  };
});
