
from django.db import models
from django.contrib.contenttypes.models import ContentType

class RevisionManager(models.Manager):
    def get_for_object(self, obj):
        ct = ContentType.objects.get_for_model(obj)
        return self.filter(content_type__pk=ct.pk, object_pk=obj.pk)
