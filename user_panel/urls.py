from django.urls import path
from .views import user_login, user_dashboard, user_logout

urlpatterns = [
    path('login/', user_login, name='login'),
    path('dashboard/', user_dashboard, name='dashboard'),
    path('logout/', user_logout, name='logout'),
]
