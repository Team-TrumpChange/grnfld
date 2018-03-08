angular.module('app')
.component('subcommentsSubmit', {
  bindings: {
    comment: '<',
    userid: '<',
    postid: '<'
  },
  controller: function (subcommentsService) {
    this.subcomments = null;
    this.submessage = '';
    this.replyClicked = false;
    
    // this.$onInit= () => {
    //   console.log('inited');
    //   console.log('this.comment', this.comment);
    //   console.log('this.userId:', this.userid);
    //   console.log('this.comment.comment_id', this.comment.comment_id)
    //   subcommentsService.getSubcomments(this.comment.comment_id, (data) => {
    //     console.log('data from getSubcomments:', data);
    //     this.subcomments = data;
    //  });
    // }


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
          this.submessage = '';
          this.showReplyForm();
        });
      }
    };

    
    this.showReplyForm = () => {
      console.log('clicked');
      this.replyClicked = !this.replyClicked;
    }
  },
  templateUrl: 'templates/subcommentsSubmit.html'
})
