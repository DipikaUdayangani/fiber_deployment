
# apps/admin_panel/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='admin_dashboard'),  # ✅ Make sure this matches a real view
]
