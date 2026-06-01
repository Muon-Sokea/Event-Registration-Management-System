from django.test import TestCase
from rest_framework.test import APIClient
from apps.users.models import User
from apps.events.models import Event
from apps.registrations.models import Registration


class RegistrationApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.organizer = User.objects.create_user(email='org@example.com', password='pass', first_name='Org', last_name='User', role='organizer')
        self.attendee = User.objects.create_user(email='att@example.com', password='pass', first_name='Att', last_name='User', role='attendee')
        self.event = Event.objects.create(title='Paid Event', description='Test', date='2030-03-01T10:00:00Z', location='Hall', category='other', capacity=2, organizer=self.organizer)

    def test_register_creates_registration_and_prevents_duplicates(self):
        self.client.force_authenticate(user=self.attendee)
        resp = self.client.post(f'/api/events/{self.event.id}/register/', {})
        self.assertEqual(resp.status_code, 201)
        self.assertTrue(Registration.objects.filter(event=self.event, attendee=self.attendee).exists())

        # second registration should fail
        resp2 = self.client.post(f'/api/events/{self.event.id}/register/', {})
        self.assertEqual(resp2.status_code, 400)
from django.test import TestCase

# Create your tests here.
