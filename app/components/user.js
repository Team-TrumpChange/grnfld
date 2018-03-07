angular.module('app')
  .controller('UserCtrl', function ($scope, postsService, $rootScope, commentsService) {
    $('.alert .close').on('click', function (e) {
      $(this).parent().hide();
    });

    $scope.init = function () {
      $scope.currentPage = 1;
      $scope.numPerPage = 5;
      $scope.currentCommentPage = 1;

      //get all posts on page load
      postsService.getUserPosts($rootScope.userId, data => {
        console.log('got posts', data);
        $scope.userPosts = data;

        //pagination
        $scope.$watch('currentPage + numPerPage', function () {
          //filter posts by page number
          let begin = (($scope.currentPage - 1) * $scope.numPerPage);
          let end = begin + $scope.numPerPage;

          $scope.filteredPosts = $scope.userPosts.slice(begin, end);
        });
      });

      commentsService.getUserComments($rootScope.userId, data => {
        console.log('got commented posts', data);
        $scope.userComments = data;

        //pagination
        $scope.$watch('currentCommentPage + numPerPage', function () {
          //filter posts by page number
          let begin = (($scope.currentCommentPage - 1) * $scope.numPerPage);
          console.log(begin);
          let end = begin + $scope.numPerPage;
          console.log(end);
          $scope.filteredComments = $scope.userComments.slice(begin, end);
          console.log($scope.filteredComments, 'this pages comments');
        });
      })
    };

    //runs init on view startup
    $scope.init();

    $scope.handlePostClick = (clickedValue) => {
      $scope.currentPost = $scope.filteredPosts[clickedValue];
      //get all comments from clicked post
      commentsService.getComments($scope.currentPost.post_id, (data) => {
        console.log('comments', data);
        $scope.comments = data;
        $scope.comments.forEach(comment => comment.message = comment.message.replace(/\{\{([^}]+)\}\}/g, '<code>$1</code>'));
        $scope.currentIndex = clickedValue; //sets index for when submit comment is clicked
      });

    };

    $scope.handleCommentClick = (clickedValue) => {
      $scope.currentComment = $scope.filteredComments[clickedValue];
      console.log('comment click!!!!');
      console.log($scope.currentComment, $scope.currentComment.post.title);
      //get all comments from clicked post
      commentsService.getComments($scope.currentComment.post_id, (data) => {
        $scope.postComments = data;
        $scope.postComments.forEach(comment => comment.message = comment.message.replace(/\{\{([^}]+)\}\}/g, '<code>$1</code>'));
        console.log($scope.postComments);
        $scope.currentIndex = clickedValue; //sets index for when submit comment is clicked
      }); //having these indexes the same might do weird things later on

    };

    //hacky way of refreshing the current view to get new posts
    $scope.refresh = () => {
      $scope.init();
    };

    $scope.message = '';

    $scope.submitComment = (isValid) => {
      if (isValid) {
        let commentObj = {
          user_id: $rootScope.userId,
          post_id: $scope.currentPost.post_id,
          message: $scope.message
        };
        commentsService.submitNewComment(commentObj, (data) => {
          $scope.message = '';
          $scope.handlePostClick($scope.currentIndex);
        });
      }
    };

    $scope.submitCommentComment = (isValid) => {
      if (isValid) {
        let commentObj = {
          user_id: $rootScope.userId,
          post_id: $scope.currentComment.post_id,
          message: $scope.message
        };
        commentsService.submitNewComment(commentObj, (data) => {
          $scope.message = '';
          $scope.handleCommentClick($scope.currentIndex);
        });
      }
    };

    $scope.selectSolution = (comment) => {
      if ($rootScope.userId === $scope.currentPost.user_id) {
        $scope.currentPost.solution_id = comment.comment_id; //changes local solution_id so that star moves without refresh
        commentsService.selectSolution(comment.comment_id, $scope.currentPost.post_id);
        console.log('select Solution completed');
      }
    };

    $scope.likeComment = async (commentId, index) => {
      //need commmentId, usernameId(rootscope), how many coins to use (ng-click to send one and ng-double click to send more?)
      //TODO add modal for ng-doubleclick
      if ($rootScope.hackcoin <= 0) {
        $('#like-error').show();
      } else {
        let res = await commentsService.likeComment({
          commentId: commentId,
          userId: $rootScope.userId,
          hackCoins: 1
        });

        if (res.status === 200) {
          $scope.$apply(() => {
            --$rootScope.hackcoin;
            $scope.comments[index].votes++;
          });
        }
      }
    };
  });
