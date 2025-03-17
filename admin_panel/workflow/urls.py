from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.dashboard, name='dashboard'),
    path('add-user/', views.add_user, name='add_user'),
    path('manage-users/', views.manage_users, name='manage_users'),
    path('tasks/', views.tasks, name='tasks'),
    path('workgroups/', views.workgroups, name='workgroups'),
    path('settings/', views.settings, name='settings'),
    path('logout/', views.logout_view, name='logout'),
    path('', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
 

]