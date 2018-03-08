angular.module('app')
  .component('subcomments', {
    bindings: {
      comment: '<',
      userid: '<',
      postid: '<',
      userid: '<'
    },
    controller: function (subcommentsService) {
      this.subcomments = null;
      this.showSubcomments = false;
      this.submessage = '';
      this.replyClicked = false;


      this.submitSubcomment = (isValid) => {
        console.log('isValid from submitSubcomment:', isValid);
        if (isValid) {

          let subcommentObj = {
            user_id: this.userid,
            post_id: this.postid,
            comment_id: this.comment.comment_id,
            submessage: this.submessage
          }
          console.log('subcommentObj:', subcommentObj);
          subcommentsService.submitNewSubcomment(subcommentObj, (data) => {
            console.log('insubcommentsService data:', data);
            this.submessage = '';
            this.showSubcomments = false;
            this.getSubcomments();
          });
        }
      };


      this.showReplyForm = () => {
        console.log('clicked');
        this.replyClicked = !this.replyClicked;
        console.log('this.replyClicked:', this.replyClicked)
      }


      this.toggleSubcomments = () => {
        this.showSubcomments = !this.showSubcomments;
      };

      this.getSubcomments = () => {
        if (this.showSubcomments) {
          this.showSubcomments = false;
        } else {
          console.log('clicked');
          subcommentsService.getSubcomments(this.comment.comment_id, (data) => {
            console.log('data from getSubcomments:', data);
            this.subcomments = data;
            this.showSubcomments = true;
          });
        }
      };
    },

     templateUrl: 'templates/subcomments.html'
  });