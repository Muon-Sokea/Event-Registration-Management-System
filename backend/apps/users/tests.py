from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()

class UserModelTest(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(email='test@example.com', password='test123', first_name='Test', last_name='User')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('test123'))
        self.assertEqual(user.role, 'attendee')
        self.assertFalse(user.is_staff)

    def test_create_superuser(self):
        admin = User.objects.create_superuser(email='admin@example.com', password='admin123', first_name='Admin', last_name='User')
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_staff)
        self.assertEqual(admin.role, 'admin')

class AuthAPITest(APITestCase):
    def test_registration(self):
        data = {'email': 'newuser@example.com', 'first_name': 'New', 'last_name': 'User', 'password': 'newpass123'}
        response = self.client.post('/api/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('email', response.data)

    def test_login(self):
        User.objects.create_user(email='user@example.com', password='pass1234', first_name='A', last_name='B')
        response = self.client.post('/api/login/', {'email': 'user@example.com', 'password': 'pass1234'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)