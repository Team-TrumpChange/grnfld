angular.module('app')
  .controller('MainCtrl', function ($scope, $rootScope, 
    postsService, commentsService, usersService, sortService, 
    $location) {
  $('.alert .close').on('click', function (e) {
    $(this).parent().hide();
  });

  $scope.init = function() {
    console.log('init');
    usersService.autoLogin((user) => {
      if (user) {
        console.log(user)
        $rootScope.userId = user.user_id;
        $rootScope.hackcoin = user.hackcoin;
        $rootScope.questcoin = user.questcoin;
        $rootScope.userPageUser = user.user_id;
      } 
    });

    $scope.currentPage = 1;
    $scope.numPerPage = 5;
    //get all posts on page load
    postsService.getAll(data => {
      console.log('got posts', data);
      if (!$scope.posts || $scope.posts.length !== data.length) {
        $scope.posts = data;
      } 

      //pagination
      $scope.$watch('currentPage + numPerPage', function () {
        //filter posts by page number
        let begin = (($scope.currentPage - 1) * $scope.numPerPage);
        let end = begin + $scope.numPerPage;

        $scope.filteredPosts = $scope.posts.slice(begin, end);
      });
    });
  };

  //runs init on view startup
  $scope.init();

  $scope.handlePostClick = (clickedValue) => {
    $scope.currentPost = $scope.filteredPosts[clickedValue];
    //get all comments from clicked post
    commentsService.getComments($scope.currentPost.post_id, (data) => {
      $scope.comments = data;
      $scope.comments.forEach(comment => comment.message = comment.message.replace(/\{\{([^}]+)\}\}/g, '<code>$1</code>')); // what this means?
      $scope.currentIndex = clickedValue; //sets index for when submit comment is clicked
    });
  };

  $scope.handleUsernameClick = (userId) => {
    $rootScope.userPageUser = userId;
    $location.path('/user');
  }

  //hacky way of refreshing the current view to get new posts
  $scope.refresh = () => {
    $scope.init();
  };

  $scope.warning = '';
  $scope.meanMessage = '';
  $scope.message = '';


  $scope.submitComment = (isValid) => {
    if (isValid) {
      let commentObj = {
        user_id: $rootScope.userId,
        post_id: $scope.currentPost.post_id,
        message: $scope.message,
        questcoin: $rootScope.questcoin
      };
      commentsService.submitNewComment(commentObj, (data) => {
        if (data.data.rejection) {
          $scope.meanMessage = data.data.rejection;
          $scope.warning = 'Please make constructive comments only';
        } else {
          $('#like-error').hide();
          $scope.warning = '';
          $scope.message = '';
          $scope.handlePostClick($scope.currentIndex);
          $rootScope.questcoin++
        }
      });
    }
  };


  $scope.toggleSolution = (comment) => {
    if ($scope.currentPost.solution_id) {
      if ($rootScope.userId === $scope.currentPost.user_id) {
        commentsService.unSelectSolution(comment.comment_id, () => {
          $scope.currentPost.solution_id = false;
          console.log('$scope.currentPost.solution_id:', $scope.currentPost.solution_id);
        });
      }
    } else {
      if ($rootScope.userId === $scope.currentPost.user_id) {
        $scope.currentPost.solution_id = comment.comment_id; //changes local solution_id so that star moves without refresh
        commentsService.selectSolution(comment.comment_id, $scope.currentPost.post_id);
      }
    }
  };


  $scope.likeComment = async (commentId, index) => {
    //need commmentId, usernameId(rootscope), how many coins to use (ng-click to send one and ng-double click to send more?)
    //TODO add modal for ng-doubleclick
    if ($rootScope.questcoin <= 0) {
      console.log('not enough coins')
      $('#like-error').show();
    } else {
      let res = await commentsService.likeComment({
        commentId: commentId,
        userId: $rootScope.userId,
        questcoin: 1
      });

      if (res.status === 200) {
        $scope.$apply(() => {
          //--$rootScope.hackcoin;
          --$rootScope.questcoin
          $scope.comments[index].votes++;
        });
      }
    }
  };

  $scope.markPostSolved = (postId) => {
    postsService.closePost(postId, function(data) {
      $scope.posts[$scope.currentIndex].closed = true;
    });
  };


  $scope.sortType = $scope.sortType || "recent";

  $scope.sortPosts = (sortType) => {
    
    switch (sortType) {
      case 'recent' :
        $scope.sortType = "recent";
        $scope.posts = sortService.dateSort($scope.posts, 'post_id');
        break;
      case 'title' :
        $scope.sortType = "title";
        $scope.posts = sortService.alphabetize($scope.posts, 'title');
        break;   
      case 'username' :
        $scope.sortType = "username";
        $scope.posts = sortService.alphabetize($scope.posts, 'username');
        break;
      case 'status' :
        $scope.sortType = "status";
        $scope.posts = sortService.boolSort($scope.posts);
        break;
    }
    $scope.refresh();
  }
});
