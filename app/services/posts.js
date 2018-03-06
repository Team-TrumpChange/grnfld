angular.module('app')
.service('postsService', function ($http) {
  this.getAll = function (callback) {
    $http.get('/posts')
      .then(function ({ data }) {
        callback(data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  this.getUserPosts = function (userId, callback) {
    $http.get(`/userPosts?userId=${userId}`)
      .then(function({data}) {
        callback(data);
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  this.submitNewPost = function (newPostObj, callback) {
    $http.post('/createPost', newPostObj)
      .then(function (data) {
        callback(data);
      })
      .catch(function (err) {
        console.log(err);
    });
  };
});
