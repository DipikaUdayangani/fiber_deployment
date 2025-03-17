from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin
from .models import User, Task, TaskAssignment 

admin.site.register(User, UserAdmin)
admin.site.register(Task)
admin.site.register(TaskAssignment)

# Register your models here.
from django.contrib import admin
from .models import Workgroup, Task, TaskAssignment

@admin.register(Workgroup)
class WorkGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'created_by', 'assigned_workgroup', 'due_date', 'created_at')
    list_filter = ('status', 'assigned_workgroup')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'

@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ('task', 'user', 'assigned_at', 'completed_at')
    list_filter = ('completed_at', 'assigned_at')
    search_fields = ('task_title', 'user_username')
    
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('username', 'email', 'is_staff', 'is_active')  # Customize as needed
    search_fields = ('username', 'email')
    ordering = ('username',)

admin_site = admin.site

if not admin_site.is_registered(Task):
    @admin.register(Task)
    class TaskAdmin(admin.ModelAdmin):
        list_display = ('id', 'name', 'created_by')
        search_fields = ('name',)
        ordering = ('id',)

if not admin_site.is_registered(TaskAssignment):
    @admin.register(TaskAssignment)
    class TaskAssignmentAdmin(admin.ModelAdmin):
        list_display = ('id', 'task', 'user')
        search_fields = ('task__name', 'user__username')
        ordering = ('id',)