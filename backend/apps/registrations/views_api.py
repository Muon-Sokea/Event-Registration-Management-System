from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Registration
from .serializers import RegistrationSerializer
from apps.events.models import Event
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.mail import send_mail


class RegistrationCreateView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        event = get_object_or_404(Event, pk=self.kwargs['event_pk'])
        if event.registrations.count() >= event.capacity:
            from rest_framework import serializers as drf_serializers
            raise drf_serializers.ValidationError("Event is full.")
        if Registration.objects.filter(event=event, attendee=self.request.user).exists():
            from rest_framework import serializers as drf_serializers
            raise drf_serializers.ValidationError("You are already registered for this event.")
        registration = serializer.save(attendee=self.request.user, event=event)

        # Send confirmation email (development: console backend)
        subject = f"Registration Confirmed: {event.title}"
        message = (
            f"Hello {self.request.user.first_name},\n\n"
            f"You have successfully registered for '{event.title}' on {event.date}.\n"
            f"Ticket Code: {registration.ticket_code}\n\n"
            "Thank you,\nClub Center"
        )
        recipient = [registration.attendee.email]
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient, fail_silently=False)

class UserRegistrationsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(attendee=self.request.user)

class RegistrationCancelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        registration = get_object_or_404(Registration, pk=pk, attendee=request.user)
        if registration.status == 'cancelled':
            return Response(
                {"detail": "Registration is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )
        registration.status = 'cancelled'
        registration.save()
        serializer = RegistrationSerializer(registration)

        # Send cancellation email
        subject = f"Registration Cancelled: {registration.event.title}"
        message = (
            f"Hello {registration.attendee.first_name},\n\n"
            f"Your registration for '{registration.event.title}' scheduled on {registration.event.date} has been cancelled.\n\n"
            "If this was a mistake, you can re-register from your dashboard.\n\n"
            "Club Center"
        )
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [registration.attendee.email], fail_silently=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
class RegistrationPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        registration = get_object_or_404(Registration, pk=pk, attendee=request.user)
        if registration.status == 'confirmed':
            return Response(
                {"detail": "Registration is already confirmed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if registration.status == 'cancelled':
            return Response(
                {"detail": "Cannot pay for a cancelled registration."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Simulate payment success
        registration.status = 'confirmed'
        registration.save()
        serializer = RegistrationSerializer(registration)
        # Send payment/confirmation email
        subject = f"Registration Paid: {registration.event.title}"
        message = (
            f"Hello {registration.attendee.first_name},\n\n"
            f"Your payment for '{registration.event.title}' was successful and your registration is confirmed.\n"
            f"Ticket Code: {registration.ticket_code}\n\n"
            "See you there!\nClub Center"
        )
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [registration.attendee.email], fail_silently=False)
        return Response(serializer.data, status=status.HTTP_200_OK)