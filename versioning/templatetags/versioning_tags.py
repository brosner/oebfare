
from django.template import Library, Node, TemplateSyntaxError, Variable, resolve_variable

from versioning.models import Revision

register = Library()

class RevisionsForObjectNode(Node):
    def __init__(self, obj, context_var):
        self.obj = Variable(obj)
        self.context_var = context_var
    
    def render(self, context):
        context[self.context_var] = \
            Revision.objects.get_for_object(self.obj.resolve(context))
        return ""

def do_revisions_for_object(parser, token):
    """
    Retrieves a list of ``Revision`` objects associated with an object and
    stores them in a context variable.
    
    Usage::
    
        {% revisions_for_object [object] as [varname] %}
    
    Example::
    
        {% revisions_for_object post as revisions %}
    """
    bits = token.contents.split()
    if len(bits) != 4:
        raise TemplateSyntaxError("'%s' tag requires exactly three "
                                  "arguments" % bits[0])
    if bits[2] != "as":
        raise TemplateSyntaxError("second argument to %s tag must be "
                                  "'as'" % bits[0])
    return RevisionsForObjectNode(bits[1], bits[3])

register.tag("revisions_for_object", do_revisions_for_object)
