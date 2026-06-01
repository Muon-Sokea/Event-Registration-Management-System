from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Registration


@receiver(post_save, sender=Registration)
def send_registration_email(sender, instance, created, **kwargs):
    if created:
        subject = f"Registration Confirmed: {instance.event.title}"
        message = (
            f"Hi {instance.attendee.first_name},\n\n"
            f"You have successfully registered for '{instance.event.title}'.\n"
            f"Your ticket code is: {instance.ticket_code}\n"
            f"Event date: {instance.event.date}\n"
            f"Location: {instance.event.location}\n\n"
            "Thank you!"
        )
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [instance.attendee.email])
