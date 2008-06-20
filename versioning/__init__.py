
registry = []

class AlreadyRegistered(Exception):
    pass

def register(model):
    """
    """
    from django.db.models import signals as model_signals
    from versioning.signals import pre_save
    
    if model in registry:
        raise AlreadyRegistered
    registery.append(model)
    
    dispatcher.connect(pre_save, signal=model_signals.pre_save, sender=model)
