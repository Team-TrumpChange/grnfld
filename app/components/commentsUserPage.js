angular.module('app')
  .directive('commentsUserPage', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/comments-list.html',
    };
  });
