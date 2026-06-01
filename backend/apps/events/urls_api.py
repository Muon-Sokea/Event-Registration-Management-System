from django.urls import path
from .views_api import EventListCreateView, EventDetailView, DashboardStatsView

urlpatterns = [
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
]