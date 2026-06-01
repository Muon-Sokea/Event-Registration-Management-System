from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    organizer_email = serializers.EmailField(source='organizer.email', read_only=True)
    image = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'date', 'location',
            'category', 'capacity', 'price', 'organizer',
            'organizer_email', 'image', 'created_at'
        ]
        read_only_fields = ['organizer', 'created_at']