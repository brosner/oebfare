
from django.contrib.contenttypes.models import ContentType

from versioning.models import Revision

def pre_save(instance, **kwargs):
    """
    """
    model = kwargs["sender"]
    original = model._default_manager.get(pk=instance.pk)
    rev = Revision(object_pk=instance.pk,
                   content_type=ContentType.objects.get_for_model(model))
    rev.save()
