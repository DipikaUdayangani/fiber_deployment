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
    path('api/projects/count/', views.get_project_count, name='get_project_count'),
    path('api/projects/<int:project_id>/', views.get_project_details, name='get_project_details'),
    path('api/projects/<int:project_id>/update/', views.update_project, name='update_project'),
    path('api/projects/<int:project_id>/delete/', views.delete_project, name='delete_project'),

    # API endpoints for tasks
    path('api/tasks/', views.tasks_api, name='tasks_api'),
    path('api/tasks/create/', views.create_task, name='create_task'),
    path('api/tasks/<int:task_id>/', views.get_task_details, name='get_task_details'),
    path('api/tasks/<int:task_id>/update/', views.update_task, name='update_task'),
    path('api/tasks/<int:task_id>/delete/', views.delete_task, name='delete_task'),

    # API endpoints for users
    path('api/users/', views.get_users, name='get_users'),
    path('api/users/list/', views.get_users, name='get_users_list'),  # For the manage users page
    path('api/users/add/', views.add_user, name='add_user'),
    path('api/users/<int:user_id>/', views.get_user_details, name='get_user_details'),
    path('api/users/<int:user_id>/update/', views.update_user, name='update_user'),
    path('api/users/<int:user_id>/delete/', views.delete_user, name='delete_user'),
    path('api/users/<int:user_id>/status/', views.update_user_status, name='update_user_status'),
    path('api/users/activities/', views.get_user_activities, name='get_user_activities'),
    path('api/users/<int:user_id>/activities/', views.get_user_activities, name='get_user_activities_by_id'),

    # API endpoints for RTOMs
    path('api/rtoms/', views.get_rtoms, name='get_rtoms'),
]
