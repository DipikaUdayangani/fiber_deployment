from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Task, TaskAssignment, Workgroup

# Register Workgroup
@admin.register(Workgroup)
class WorkGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')

# Register Task
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'created_by', 'assigned_workgroup', 'due_date', 'created_at')
    list_filter = ('status', 'assigned_workgroup')
    search_fields = ('title', 'description')
    date_hierarchy = 'created_at'

# Register TaskAssignment
@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ('task', 'user', 'assigned_at', 'completed_at')
    list_filter = ('completed_at', 'assigned_at')
    search_fields = ('task_title', 'user_username')



# Register User with appropriate fields for your custom model
@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    # Only include fields that actually exist on your User model
    list_display = ('email', 'is_active')  # Adjust based on your actual fields
    search_fields = ('email',)
    ordering = ('email',)
    # Remove filter_horizontal if these fields don't exist

# Keep the rest of your admin registrations as is