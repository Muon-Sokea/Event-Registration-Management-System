from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'category', 'capacity', 'price', 'organizer', 'created_at')
    list_filter = ('category', 'date')
    search_fields = ('title', 'location', 'description')