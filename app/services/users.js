angular.module('app')
.service('usersService', function ($http) {
  this.login = function (username, password, callback) {
    $http.post('/login', {
      username: username,
      password: password
    })
      .then(function (data) {
        callback(data);
      })
      .catch(function (err) {
        callback(err);
    });
  };

  this.register = function (username, password, email, skills, callback) {
    $http.post('/register', {
      username: username,
      password: password,
      email: email,
      skills: skills,
    })
      .then(function (data) {
        callback(data);
      })
      .catch(function (err) {
        callback(err);
    });
  };
});
