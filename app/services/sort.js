angular.module('app')
  .service('sortService', function () {
    this.dateSort = (prop, posts) => {
      return posts.sort(function (a, b) {
        if (a[prop] > b[prop]) {
          return -1;
        } else if (a[prop] < b[prop]) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    this.alphabetize = (prop, posts) => {
      return posts.sort(function (a, b) {
        if (a[prop].toLowerCase() > b[prop].toLowerCase()) {
          return 1;
        } else if (a[prop].toLowerCase() < b[prop].toLowerCase()) {
          return -1;
        } else {
          return 0;
        }
      })
    }

    this.boolSort = (posts) => {
      console.log('made it this far');
      return posts.sort(function (a, b) {
        if ((a.closed && b.closed) || (!a.closed && !b.closed)) {
          return 0;
        } else if (a.status) {
          return -1;
        } else {
          return 1;
        }
      });
    }

  });