angular.module('app')
  .service('subcommentsService', function ($http) {
    this.submitNewSubcomment = function (newSubcommentObj, callback) {
      $http.post('/createSubcomment', newSubcommentObj)
        .then(function (data) {
          callback(data);
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    // this.likeComment = async (newLikeObj) => {
    //   return await $http.post('/coin', newLikeObj)
    // };

    //grab comments
    // this.getComments = function (postId, callback) {
    //   $http.get('/comments', {
    //     params: { postId: postId }
    //   })
    //     .then(function ({ data }) {
    //       callback(data);
    //     })
    //     .catch(function (err) {
    //       console.log(err);
    //     });
    // };

    // this.selectSolution = async (commentId, postId) => {
    //   await $http.post('/solution', {
    //     postId: postId, commentId: commentId
    //   });
    // };
  });

