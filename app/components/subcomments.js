angular.module('app')
  .component('subcomments', {
    bindings: {
      comment: '<',
      userid: '<',
      postid: '<'
    },
    controller: function (subcommentsService) {
      this.subcomments = null;
      this.showSubcomments = false;

      // this.$onInit = () => {
      //   console.log('inited');
      //   console.log('this.comment', this.comment);
      //   console.log('this.userId:', this.userid);
      //   console.log('this.comment.comment_id', this.comment.comment_id)
      //   subcommentsService.getSubcomments(this.comment.comment_id, (data) => {
      //     console.log('data from getSubcomments:', data);
      //     this.subcomments = data;
      //   });
      // }
      // this.toggleSubcomments = function() {
      //   console.log('clicked');
      //   this.showSubcomments = !this.showSubcomments;
      // }

      this.getSubcomments = () => {
        console.log('clicked');
        subcommentsService.getSubcomments(this.comment.comment_id, (data) => {
          console.log('data from getSubcomments:', data);
          this.subcomments = data;
          this.showSubcomments = true;
        });
      }
    },

     templateUrl: 'templates/subcomments.html'
  });