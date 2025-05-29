# apps/employee_panel/urls.py

from django.urls import path
from django.contrib.auth.decorators import login_required
from . import views

app_name = 'employee_panel'

urlpatterns = [
    path('dashboard/', login_required(views.dashboard_view), name='dashboard'),
    path('tasks/', login_required(views.tasks_view), name='tasks'),
    path('projects/', login_required(views.projects_view), name='projects'),
    path('profile/', login_required(views.profile_view), name='profile'),
]
