
from django.contrib import admin
from versioning.admin import RevisionInline
from oebfare.blog.models import Post

class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "pub_date")
    list_display_links = ("id", "title")
    search_fields = ("title", "text")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [
        RevisionInline,
    ]

admin.site.register(Post, PostAdmin)
