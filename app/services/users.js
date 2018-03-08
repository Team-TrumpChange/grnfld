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

  this.autoLogin = function (callback) {
    $http.post('/autoLogin')
      .then(function(response) {
        let data = response.data;
        if (data) {
          callback(data);
        } else {
          callback();
        }
      })
      .catch(function(error) {
        callback(error)
      });
  }

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

  this.logout = function () {
    $http.post('logout');
  }

  this.getUserDetails = function(userid, callback) {
    $http.get('/user', {
      params: {userid: userid}
    })
      .then(res => {
        callback(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  this.editUser = function(userid, newSkills, callback) {
    console.log('edit user')
    $http.patch('/user', {
      userid: userid,
      skills: newSkills
    })
      .then(res => {
        callback(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }
});
