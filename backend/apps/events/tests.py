from django.test import TestCase
from rest_framework.test import APIClient
from apps.users.models import User
from apps.events.models import Event


class EventPermissionsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # create users
        self.admin = User.objects.create_user(email='admin@example.com', password='pass', first_name='Admin', last_name='User', role='admin')
        self.organizer1 = User.objects.create_user(email='org1@example.com', password='pass', first_name='Org1', last_name='User', role='organizer')
        self.organizer2 = User.objects.create_user(email='org2@example.com', password='pass', first_name='Org2', last_name='User', role='organizer')

        # create events
        self.event1 = Event.objects.create(title='Event 1', description='E1', date='2030-01-01T10:00:00Z', location='Hall A', category='other', capacity=100, organizer=self.organizer1)
        self.event2 = Event.objects.create(title='Event 2', description='E2', date='2030-02-01T10:00:00Z', location='Hall B', category='other', capacity=50, organizer=self.organizer2)

    def test_organizer_sees_only_their_events(self):
        self.client.force_authenticate(user=self.organizer1)
        resp = self.client.get('/api/events/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        # organizer1 should only see event1
        self.assertTrue(any(e['id'] == self.event1.id for e in data))
        self.assertFalse(any(e['id'] == self.event2.id for e in data))

    def test_organizer_cannot_update_other_event(self):
        self.client.force_authenticate(user=self.organizer1)
        payload = {'title': 'Hacked Title'}
        resp = self.client.put(f'/api/events/{self.event2.id}/', payload, format='json')
        self.assertIn(resp.status_code, (403, 404))
from django.test import TestCase

# Create your tests here.
