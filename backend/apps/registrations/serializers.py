from rest_framework import serializers
from .models import Registration

class RegistrationSerializer(serializers.ModelSerializer):
    attendee_email = serializers.EmailField(source='attendee.email', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    ticket_code = serializers.SerializerMethodField()

    class Meta:
        model = Registration
        fields = ['id', 'event', 'event_title', 'attendee', 'attendee_email',
                  'status', 'ticket_code', 'registered_at']
        read_only_fields = ['attendee', 'event', 'registered_at', 'ticket_code']

    def get_ticket_code(self, obj):
        return f"EVT{obj.event.id:02d}-REG{obj.id:03d}"