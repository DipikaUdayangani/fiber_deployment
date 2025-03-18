from django.urls import path
from . import views

app_name = 'user_panel'

urlpatterns = [
    
    
    path('dashboard/', views.user_dashboard, name='dashboard'),
    path('tasks/', views.user_tasks, name='user_tasks'),
    path('tasks/<int:task_id>/', views.task_detail, name='task_detail'),
    path('projects/', views.project_list, name='project_list'),
    path('projects/<int:project_id>/', views.project_detail, name='project_detail'),
    
    
]