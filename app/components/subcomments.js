angular.module('app')
  .component('subcomments', {
    bindings: {
      comment: '<',
      userid: '<',
      postid: '<',
      userid: '<',
      currentPost: '<'
    },
    controller: function (subcommentsService) {
      this.subcomments = null;
      this.showSubcomments = false;
      this.submessage = '';
      this.replyClicked = false;


      this.submitSubcomment = (isValid) => {
        if (isValid) {

          let subcommentObj = {
            user_id: this.userid,
            post_id: this.postid,
            comment_id: this.comment.comment_id,
            submessage: this.submessage
          }
          subcommentsService.submitNewSubcomment(subcommentObj, (data) => {
            this.submessage = '';
            this.showReplyForm();
            this.showSubcomments = false;
            this.getSubcomments();
          });
        }
      };


      this.showReplyForm = () => {
        this.replyClicked = !this.replyClicked;
      }


      this.toggleSubcomments = () => {
        this.showSubcomments = !this.showSubcomments;
      };

      this.getSubcomments = () => {
        if (this.showSubcomments) {
          this.showSubcomments = false;
        } else {
          subcommentsService.getSubcomments(this.comment.comment_id, (data) => {
            this.subcomments = data;
            this.showSubcomments = true;
          });
        }
      };
    },

     templateUrl: 'templates/subcomments.html'
  });