from django.urls import path
from . import views

urlpatterns = [
    path('', views.contractor_dashboard, name='contractor_dashboard'),
]
