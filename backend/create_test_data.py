#!/usr/bin/env python
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from apps.events.models import Event
from datetime import datetime, timedelta

User = get_user_model()

# Create test users using create_user method
admin = User.objects.filter(email='admin@clubcenter.local').first()
if not admin:
    admin = User.objects.create_user(
        email='admin@clubcenter.local',
        password='admin123',
        first_name='Admin',
        last_name='User',
        role='admin'
    )

organizer1 = User.objects.filter(email='organizer1@clubcenter.local').first()
if not organizer1:
    organizer1 = User.objects.create_user(
        email='organizer1@clubcenter.local',
        password='organizer123',
        first_name='John',
        last_name='Organizer',
        role='organizer'
    )

organizer2 = User.objects.filter(email='organizer2@clubcenter.local').first()
if not organizer2:
    organizer2 = User.objects.create_user(
        email='organizer2@clubcenter.local',
        password='organizer123',
        first_name='Jane',
        last_name='Org',
        role='organizer'
    )

attendee1 = User.objects.filter(email='attendee1@clubcenter.local').first()
if not attendee1:
    attendee1 = User.objects.create_user(
        email='attendee1@clubcenter.local',
        password='attendee123',
        first_name='Alice',
        last_name='Attendee',
        role='attendee'
    )

attendee2 = User.objects.filter(email='attendee2@clubcenter.local').first()
if not attendee2:
    attendee2 = User.objects.create_user(
        email='attendee2@clubcenter.local',
        password='attendee123',
        first_name='Bob',
        last_name='Guest',
        role='attendee'
    )

# Create test events
now = datetime.now()
tomorrow = now + timedelta(days=1)
next_week = now + timedelta(days=7)

event1, _ = Event.objects.get_or_create(
    title='Tech Conference 2026',
    defaults={
        'organizer': organizer1,
        'description': 'A comprehensive tech conference featuring latest innovations in AI, web development, and cloud computing.',
        'date': next_week,
        'location': 'Convention Center, Room A',
        'capacity': 50,
        'price': 25.00,
        'category': 'technology'
    }
)

event2, _ = Event.objects.get_or_create(
    title='Sports Day Marathon',
    defaults={
        'organizer': organizer2,
        'description': 'Annual community sports marathon event. Join us for a fun day of running and fitness activities!',
        'date': tomorrow + timedelta(days=3),
        'location': 'Central Park',
        'capacity': 100,
        'price': 10.00,
        'category': 'sports'
    }
)

event3, _ = Event.objects.get_or_create(
    title='Art Workshop',
    defaults={
        'organizer': organizer1,
        'description': 'Learn modern art techniques from professional artists.',
        'date': next_week + timedelta(days=2),
        'location': 'Art Gallery, Studio B',
        'capacity': 30,
        'price': 15.00,
        'category': 'arts'
    }
)

print("✓ Created admin: admin@clubcenter.local (password: admin123)")
print("✓ Created organizer1: organizer1@clubcenter.local (password: organizer123)")
print("✓ Created organizer2: organizer2@clubcenter.local (password: organizer123)")
print("✓ Created attendee1: attendee1@clubcenter.local (password: attendee123)")
print("✓ Created attendee2: attendee2@clubcenter.local (password: attendee123)")
print(f"\n✓ Created event1: {event1.title}")
print(f"✓ Created event2: {event2.title}")
print(f"✓ Created event3: {event3.title}")
print("\n✅ Test data ready! Your system is live.")
