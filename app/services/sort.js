angular.module('app')
  .service('sortService', function () {
    this.numberSort = (array, prop, prop2) => {
      return array.sort(function (a, b) {
        if (a[prop] > b[prop]) {
          return -1;
        } else if (a[prop] < b[prop]) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    this.alphabetize = (array, prop, prop2) => {
      return array.sort(function (a, b) {
        if (prop2) {
          if (a[prop][prop2].toLowerCase() > b[prop][prop2].toLowerCase()) {
            return 1;
          } else if (a[prop][prop2].toLowerCase() < b[prop][prop2].toLowerCase()) {
            return -1;
          } else {
            return 0;
          }
        } else {
          if (a[prop].toLowerCase() > b[prop].toLowerCase()) {
            return 1;
          } else if (a[prop].toLowerCase() < b[prop].toLowerCase()) {
            return -1;
          } else {
            return 0;
          }
        }
      })
    }

    this.boolSort = (array) => {
      console.log('made it this far');
      return array.sort(function (a, b) {
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