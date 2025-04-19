from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('', views.login_view, name='login'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('password-reset/', views.password_reset_view, name='password_reset'),
    path('register/', views.register_view, name='register'),
]

# filepath: c:\Users\ASUS\SLT\fiber_deployment\ossdeployment\ossdeployment\settings.py
# ...existing code...

LOGIN_URL = 'accounts:login'
LOGIN_REDIRECT_URL = 'accounts:dashboard'

# ...existing code...
