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
    
    # API endpoints
    path('api/tasks/', login_required(views.get_tasks), name='api_get_tasks'),
    path('api/tasks/<int:task_id>/upload/', login_required(views.upload_task_document), name='api_upload_task_document'),
]
