from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, RTOM, Task, Project, TaskAssignment

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'employee_number', 'workgroup', 'rtom')
    list_filter = ('workgroup', 'rtom')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('employee_number', 'workgroup', 'rtom')}),
    )

@admin.register(RTOM)
class RTOMAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'area_type')
    search_fields = ('name', 'code')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('name', 'assigned_workgroup', 'area_condition', 'status')
    list_filter = ('assigned_workgroup', 'area_condition', 'status')
    search_fields = ('name', 'description')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'rtom', 'status', 'created_at')
    list_filter = ('rtom', 'status')
    search_fields = ('name',)

@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ('task', 'project', 'assigned_to', 'status', 'created_at', 'completed_at')
    list_filter = ('status', 'project', 'assigned_to__workgroup')
    search_fields = ('task__name', 'project__name', 'assigned_to__employee_number')
    readonly_fields = ('created_at', 'updated_at', 'completed_at')

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'task', 'project', 'assigned_to'
        )
