angular.module('app')
  .controller('UserCtrl', function ($scope, $rootScope, 
    postsService, commentsService, usersService, sortService, 
    $location) {
    $('.alert .close').on('click', function (e) {
      $(this).parent().hide();
    });

    $scope.init = function () {
      $scope.self = $rootScope.userPageUser === $rootScope.userId;
      $scope.currentPage = 1;
      $scope.numPerPage = 5;
      $scope.currentCommentPage = 1;
      
      if(!$rootScope.userPageUser) {
        $location.path('/');
      } else {
        usersService.getUserDetails($rootScope.userPageUser, user => {
          $scope.user = user;
          $scope.name = $scope.self ? 'You' : $scope.user.username;
        })
        //get all posts on page load
        postsService.getUserPosts($rootScope.userPageUser, data => {
          if (!$scope.userPosts || $scope.userPosts.length !== data.length) { //maintain sort through refresh
            $scope.userPosts = data;
          }
  
          //pagination
          $scope.$watch('currentPage + numPerPage', function () {
            //filter posts by page number
            let begin = (($scope.currentPage - 1) * $scope.numPerPage);
            let end = begin + $scope.numPerPage;
  
            $scope.filteredPosts = $scope.userPosts.slice(begin, end);
            
          });
        });
  
        commentsService.getUserComments($rootScope.userPageUser, data => {
          $scope.userComments = data;
  
          //pagination
          $scope.$watch('currentCommentPage + numPerPage', function () {
            //filter posts by page number
            let begin = (($scope.currentCommentPage - 1) * $scope.numPerPage);
            let end = begin + $scope.numPerPage;
            $scope.filteredComments = $scope.userComments.slice(begin, end);
          });
        });
      }
    };

    //runs init on view startup
    $scope.init();

    $scope.handlePostClick = (clickedValue) => {
      $scope.currentPost = $scope.filteredPosts[clickedValue];
      //get all comments from clicked post
      commentsService.getComments($scope.currentPost.post_id, (data) => {
        $scope.comments = data;
        $scope.comments.forEach(comment => comment.message = comment.message.replace(/\{\{([^}]+)\}\}/g, '<code>$1</code>'));
        $scope.currentIndex = clickedValue; //sets index for when submit comment is clicked
      });
    };

    $scope.handleUsernameClick = (userId) => {
      console.log('username click!', userId);
      $rootScope.userPageUser = userId;
      $scope.init();
    }

    $scope.handleCommentClick = (clickedValue) => {
      $scope.currentComment = $scope.filteredComments[clickedValue];
      //get all comments from clicked post
      commentsService.getComments($scope.currentComment.post_id, (data) => {
        $scope.postComments = data;
        $scope.postComments.forEach(comment => comment.message = comment.message.replace(/\{\{([^}]+)\}\}/g, '<code>$1</code>'));
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

    $scope.editSubmit = (isValid) => {
      if (isValid) {
        console.log('edit submission');
        usersService.editUser($rootScope.userId, $scope.user.skills, (data) => {
          console.log('edit complete', $scope.user.skills);
          $('#edit-user-modal').modal('toggle');
        });
      }
    }

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
            $scope.postComments[index].votes++;
          });
        }
      }
    };

    $scope.markPostSolved = (postId) => {
      postsService.closePost(postId, function (data) {
        $scope.userPosts[$scope.currentIndex].closed = true;
      });
    }

    $scope.sortPosts = (sortType) => {
      switch (sortType) {
        case 'recent':
          $scope.sortType = "recent";
          $scope.userPosts = sortService.dateSort('post_id', $scope.userPosts);
          break;
        case 'title':
          $scope.sortType = "title";
          $scope.userPosts = sortService.alphabetize('title', $scope.userPosts);
          break;
        case 'username':
          $scope.sortType = "username";
          $scope.userPosts = sortService.alphabetize('username', $scope.userPosts);
          break;
        case 'status':
          $scope.sortType = "status";
          $scope.userPosts = sortService.boolSort($scope.userPosts);
          break;
      }
      $scope.refresh();
    }
  });
