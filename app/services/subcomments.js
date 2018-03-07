angular.module('app')
  .service('subcommentsService', function ($http) {
    this.submitNewSubcomment = function (newSubcommentObj, callback) {
      $http.post('/createSubcomment', newSubcommentObj)
        .then(function (data) {
          callback(data);
        })
        .catch(function (err) {
          console.log('err:', err);
        });
    };

    // this.likeComment = async (newLikeObj) => {
    //   return await $http.post('/coin', newLikeObj)
    // };

    // grab subcomments
    this.getSubcomments = function (commentId, callback) {
      console.log('commentId in getSubcomments', commentId);
      $http.get('/subcomments', {
        params: { commentId: commentId }
      })
        .then(function ({ data }) {
          callback(data);
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    // this.selectSolution = async (commentId, postId) => {
    //   await $http.post('/solution', {
    //     postId: postId, commentId: commentId
    //   });
    // };
  });

