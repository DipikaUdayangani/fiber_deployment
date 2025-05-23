# apps/employee_panel/urls.py

from django.urls import path
from . import views

app_name = 'employee_panel'

urlpatterns = [
    path('dashboard/', views.dashboard_view, name='dashboard'),
]
