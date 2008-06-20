
from datetime import datetime

from django.db import models
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType

from versioning.managers import RevisionManager

class Revision(models.Model):
    """
    A single revision for an object.
    """
    object_pk = models.PositiveIntegerField()
    content_type = models.ForeignKey(ContentType)
    content_object = generic.GenericForeignKey("object_pk", "content_type")
    created_at = models.DateTimeField(default=datetime.now)
    
    objects = RevisionManager()
    
    class Admin:
        list_display = ("content_type", "object_pk", "created_at")
        list_filter = ("created_at", "content_type",)
