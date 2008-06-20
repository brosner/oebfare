
from datetime import datetime

from django.db import models

class Revision(models.Model):
    """
    A single revision for an object.
    """
    object_pk = models.PositiveIntegerField()
    content_type = models.ForeignKey(ContentType)
    content_object = models.GenericForeignKey("object_pk", "content_type")
    created_at = models.DateTimeField(default=datetime.now)
