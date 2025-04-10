from django.urls import path
from . import views
from .views import  login
from .views import login_view

urlpatterns = [
    path('login/', views.login_view, name='login'),
    
    
]