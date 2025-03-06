from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.dashboard, name='dashboard'),
    path('add-user/', views.add_user, name='add_user'),
    path('manage-users/', views.manage_users, name='manage_users'),
    path('tasks/', views.tasks, name='tasks'),
    path('workgroups/', views.workgroups, name='workgroups'),
    path('settings/', views.settings, name='settings'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
]