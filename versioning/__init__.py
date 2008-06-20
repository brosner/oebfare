
registry = []

class AlreadyRegistered(Exception):
    pass

def register(model):
    """
    """
    from django.db.models import signals as model_signals
    from django.dispatch import dispatcher
    
    from versioning.signals import pre_save
    
    if model in registry:
        raise AlreadyRegistered
    registry.append(model)
    
    dispatcher.connect(pre_save, signal=model_signals.pre_save, sender=model)
