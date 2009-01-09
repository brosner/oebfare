
from django import forms
from django.contrib.comments.forms import CommentForm as DjangoCommentForm

from mailer import send_mail

class CommentForm(DjangoCommentForm):
    email_notification = forms.BooleanField()
    
    def __init__(self, *args, **kwargs):
        super(CommentForm, self).__init__(*args, **kwargs)
        # @@@ cheating :)
        self.fields.keyOrder = [
            "name",
            "email",
            "url",
            "email_notification",
            "comment",
            "honeypot",
            "content_type",
            "object_pk",
            "timestamp",
            "security_hash",
        ]
    
    def get_comment_object(self):
        comment = super(CommentForm, self).get_comment_object()
        if self.cleaned_data["email_notification"]:
            r = CommentEmailNotificationRecipient()
            r.comment = comment
            r.email_address = comment.email
            r.save()
        subject = "oebfare: A comment was posted to %s" % self.target_object.title
        message = """
A comment was posted to the blog post %(title)s. Here is the URL to that
comment:

    http://oebfare.com

If you no longer want to receive e-mail notifications for this post please
use this URL:

    http://oebfare.com
    
Thanks!
        """
        recipients = CommentEmailNotificationRecipient.objects.filter(
            post = self.target_object,
            wants_email = True,
        )
        send_mail(subject, message, "Brian Rosner <brosner@gmail.com>", [r.email_address for r in recipients])
        return comment
