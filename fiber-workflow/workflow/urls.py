from django.contrib import admin
from django.urls import path
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('users/add/', views.add_user, name='add_user'),
    path('users/manage/', views.manage_users, name='manage_users'),
    path('tasks/', views.tasks, name='tasks'),
    path('workgroups/', views.workgroups, name='workgroups'),
    path('settings/', views.settings, name='settings'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)