# apps/admin_panel/urls.py

from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('users/', views.manage_users_view, name='manage_users'),
    path('tasks/', views.tasks_view, name='tasks'),
    path('projects/', views.projects_view, name='projects'),
    path('settings/', views.settings_view, name='settings'),
    path('profile/', views.profile_view, name='profile'),
    
    # API endpoints for projects
    path('api/projects/', views.get_projects, name='get_projects'),
    path('api/projects/create/', views.create_project, name='create_project'),
    path('api/projects/<int:project_id>/', views.update_project, name='update_project'),
    path('api/projects/<int:project_id>/delete/', views.delete_project, name='delete_project'),
]
