from django.contrib import admin
from .models import Registration

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('event', 'attendee', 'status', 'registered_at')
    list_filter = ('status', 'event')
    search_fields = ('attendee__email', 'event__title')
