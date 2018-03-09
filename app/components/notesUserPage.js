angular.module('app')
  .directive('notesUserPage', function () {
    return {
      restrict: 'E',
      templateUrl: 'templates/notes-list.html',
    };
  });