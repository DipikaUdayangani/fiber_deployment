from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LoginView, LogoutView


# And in urlpatterns:

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('user_panel.urls')),
    # Use only one login path, not two overlapping ones
    path('admin-login/', LoginView.as_view(template_name='admin/login.html'), name='admin-login'),
    path('user-login/', LoginView.as_view(template_name='user/login.html'), name='user-login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('admin-panel/', include('admin_panel.urls')),  # Admin panel routes
    path('user-panel/', include('user_panel.urls')),  # User panel routes
   

]