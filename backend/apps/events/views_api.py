from django.db.models import Count
from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer
from apps.registrations.models import Registration
from apps.users.models import User

class IsOrganizerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'organizer']

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow admins full access, organizers only if they own the event
        if not request.user.is_authenticated:
            return False
        if request.user.role == 'admin':
            return True
        return hasattr(obj, 'organizer') and obj.organizer == request.user

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = [MultiPartParser, FormParser]
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsOrganizerOrAdmin()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        user = self.request.user
        # If an authenticated organizer requests the list, show only their events
        if user and user.is_authenticated and getattr(user, 'role', None) == 'organizer':
            return Event.objects.filter(organizer=user)
        return Event.objects.all()

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        return [permissions.AllowAny()]

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOrganizerOrAdmin]

    def get(self, request):
        user = request.user

        if user.role == 'admin':
            event_queryset = Event.objects.all()
            registration_queryset = Registration.objects.all()
            total_users = User.objects.count()
            total_organizers = User.objects.filter(role='organizer').count()
            total_attendees = User.objects.filter(role='attendee').count()
        else:
            event_queryset = Event.objects.filter(organizer=user)
            registration_queryset = Registration.objects.filter(event__organizer=user)
            total_users = User.objects.filter(registrations__event__organizer=user).distinct().count()
            total_organizers = 1
            total_attendees = total_users

        total_events = event_queryset.count()
        total_registrations = registration_queryset.count()
        upcoming_events = event_queryset.filter(date__gte=timezone.now()).count()

        events_by_category = {
            item['category']: item['count']
            for item in event_queryset.values('category').annotate(count=Count('id'))
        }

        registrations_per_event = [
            {
                'event_id': item['event__id'],
                'title': item['event__title'],
                'registrations': item['count']
            }
            for item in registration_queryset.values('event__id', 'event__title').annotate(count=Count('id'))
        ]

        capacity_annotation = event_queryset.annotate(registrations_count=Count('registrations'))
        open_seats_remaining = sum(
            max(event.capacity - event.registrations_count, 0)
            for event in capacity_annotation
        )

        recent_registrations = [
            {
                'id': item['id'],
                'event_title': item['event__title'],
                'attendee_email': item['attendee__email'],
                'status': item['status'],
                'registered_at': item['registered_at'],
            }
            for item in registration_queryset.order_by('-registered_at').values(
                'id', 'event__title', 'attendee__email', 'status', 'registered_at'
            )[:5]
        ]

        return Response({
            'role': user.role,
            'total_events': total_events,
            'total_registrations': total_registrations,
            'total_users': total_users,
            'total_organizers': total_organizers,
            'total_attendees': total_attendees,
            'upcoming_events': upcoming_events,
            'open_seats_remaining': open_seats_remaining,
            'events_by_category': events_by_category,
            'registrations_per_event': registrations_per_event,
            'recent_registrations': recent_registrations,
        })