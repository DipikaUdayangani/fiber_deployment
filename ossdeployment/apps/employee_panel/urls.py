# apps/employee_panel/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='employee_dashboard'),  # ✅ Update to the correct view
]
