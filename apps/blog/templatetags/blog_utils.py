
from django.template import Library
from django.utils.safestring import mark_safe

from docutils import nodes
from docutils.writers import html4css1
from docutils.core import publish_parts
from docutils.parsers.rst import directives

from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import get_lexer_by_name, TextLexer

from blog.forms import CommentForm

register = Library()

VARIANTS = {}

def pygments_directive(name, arguments, options, content, lineno,
                       content_offset, block_text, state, state_machine):
    try:
        lexer = get_lexer_by_name(arguments[0])
    except (ValueError, IndexError):
        # no lexer found - use the text one instead of an exception
        lexer = TextLexer()
    parsed = highlight(u"\n".join(content), lexer, HtmlFormatter())
    return [nodes.raw("", parsed, format="html")]
pygments_directive.arguments = (0, 1, False)
pygments_directive.content = 1
pygments_directive.options = dict([(key, directives.flag) for key in VARIANTS])

directives.register_directive("sourcecode", pygments_directive)

class HTMLWriter(html4css1.Writer):
    def __init__(self):
        html4css1.Writer.__init__(self)
        self.translator_class = HTMLTranslator

class HTMLTranslator(html4css1.HTMLTranslator):
    named_tags = []
    
    def visit_literal(self, node):
        # TODO: wrapping fixes.
        self.body.append("<code>%s</code>" % node.astext())
        raise nodes.SkipNode

def to_html(value):
    parts = publish_parts(source=value, writer=HTMLWriter(),
        settings_overrides={"initial_header_level": 2})
    return mark_safe(parts["fragment"])
register.filter("to_html", to_html)

def show_post_brief(context, post):
    return {
        "post": post,
        "last": context["forloop"]["last"],
        "can_edit": context["user"].is_staff,
    }
register.inclusion_tag("blog/post_brief.html", takes_context=True)(show_post_brief)

# a bit lazy approach, but it was quick ;)
from django.contrib.comments.templatetags.comments import CommentFormNode, RenderCommentFormNode

class OebfareCommentFormNode(CommentFormNode):
    """Insert a form for the comment model into the context."""

    def get_form(self, context):
        ctype, object_pk = self.get_target_ctype_pk(context)
        if object_pk:
            return CommentForm(ctype.get_object_for_this_type(pk=object_pk))
        else:
            return None

class OebfareRenderCommentFormNode(OebfareCommentFormNode, RenderCommentFormNode):
    pass

@register.tag
def render_oebfare_comment_form(parser, token):
    """
    Render the comment form (as returned by ``{% render_comment_form %}``) through
    the ``comments/form.html`` template.

    Syntax::

        {% render_comment_form for [object] %}
        {% render_comment_form for [app].[model] [object_id] %}
    """
    return OebfareRenderCommentFormNode.handle_token(parser, token)
