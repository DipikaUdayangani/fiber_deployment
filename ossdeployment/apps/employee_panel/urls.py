# apps/employee_panel/urls.py

from django.urls import path
from . import views

app_name = 'employee_panel'

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),
    path('projects/', views.projects_view, name='projects'),
    path('tasks/', views.tasks_view, name='tasks'),
    path('profile/', views.profile_view, name='profile'),
]
