from django.urls import path
from .views_api import RegistrationCreateView, UserRegistrationsView, RegistrationCancelView, RegistrationPaymentView

urlpatterns = [
    path('events/<int:event_pk>/register/', RegistrationCreateView.as_view(), name='register-for-event'),
    path('my-registrations/', UserRegistrationsView.as_view(), name='user-registrations'),
    path('registrations/<int:pk>/cancel/', RegistrationCancelView.as_view(), name='registration-cancel'),
    path('registrations/<int:pk>/pay/', RegistrationPaymentView.as_view(), name='registration-pay'),
]