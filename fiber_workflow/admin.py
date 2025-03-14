from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import WorkGroup, Task, TaskAssignment

@admin.register(WorkGroup)
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