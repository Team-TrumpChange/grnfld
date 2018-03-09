angular.module('app')
  .service('noteService', function ($http) {
    this.submitNote = function (newSubcommentObj, callback) {
      $http.post('/createNote', newSubcommentObj)
        .then(function (data) {
          callback(data);
        })
        .catch(function (err) {
          console.log('err:', err);
        });
    };

    this.getNotes = function (profileId, callback) {
      $http.get('/userNotes', {
        params: { profileId: profileId }
      })
        .then(function ({ data }) {
          callback(data);
        })
        .catch(function (err) {
          console.log(err);
        });
    };
  });