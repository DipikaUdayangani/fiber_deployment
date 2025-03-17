from django.urls import path
from . import views
from .views import  login

urlpatterns = [
    path('', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('login/', login, name='login'),
    path('settings/', views.settings, name='settings'),
    path('password-reset/', views.password_reset_request, name='password_reset'),
    path('password-reset/confirm/<str:uidb64>/<str:token>/', views.password_reset_confirm, name='password_reset_confirm'),
    path('add-user/', views.add_user, name='add_user'),
    path('manage-users/', views.manage_users, name='manage_users'),
    path('tasks/', views.tasks, name='tasks'),
     path('register/',views.register_view, name='register'),
    
]