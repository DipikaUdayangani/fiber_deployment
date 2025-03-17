from django.contrib import admin
from django.urls import path, include
from admin_panel.views import admin_login_view
from user_panel.views import user_login_vie
from .views import user_login, user_dashboard, user_logout

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('user_panel.urls')),
    path('login/', admin_login_view, name='admin-login'),  # Custom admin login
    path('login/', user_login, name='user-login'),  # Custom user login
    path('dashboard/', user_dashboard, name='dashboard'),
    path('logout/', user_logout, name='logout'),
    path('admin-panel/', include('admin_panel.urls')),  # Admin panel routes
    path('user-panel/', include('user_panel.urls')),  # User panel routes
]





