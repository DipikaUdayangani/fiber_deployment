from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib import messages

class User(AbstractUser):
    WORKGROUP_CHOICES = [
        ('NET-PLAN-TX', 'NET-PLAN-TX'),
        ('LEA-MNG-OPMC', 'LEA-MNG-OPMC'),
        ('NET-PLAN-ACC', 'NET-PLAN-ACC'),
        ('NET-PROJ-ACC-CABLE', 'NET-PROJ-ACC-CABLE'),
        ('XXX-MNG-OPMC', 'XXX-MNG-OPMC'),
        ('XXX-ENG-NW', 'XXX-ENG-NW'),
        ('NET-PLAN-DRAWING', 'NET-PLAN-DRAWING'),
        ('XXX-RTOM', 'XXX-RTOM'),
    ]

    employee_number = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    workgroup = models.CharField(max_length=50, choices=WORKGROUP_CHOICES)
    rtom = models.ForeignKey('RTOM', on_delete=models.SET_NULL, null=True)

    def save(self, *args, **kwargs):
        # Set employee_number to username if not provided
        if not self.employee_number:
            self.employee_number = self.username
        super().save(*args, **kwargs)

    # Add related_name to fix the clash
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to.',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        verbose_name='user permissions',
        help_text='Specific permissions for this user.',
    )

class RTOM(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    area_type = models.CharField(max_length=20, choices=[('METRO', 'Metro'), ('REGION', 'Region')])

class Task(models.Model):
    TASK_CHOICES = [
        ('SPECIFY_DESIGN', 'Specify Design Details'),
        ('APPROVE_PE', 'Approve PE'),
        ('SURVEY_FIBER', 'Survey Fiber Route'),
        ('ASSIGN_WORK', 'Assign Work'),
        ('DRAW_FIBER', 'Draw Fiber'),
        ('SPLICE_TERMINATE', 'Splice & Terminate'),
        ('UPLOAD_FIBER_OSS', 'Upload Fiber in OSS'),
        ('CONDUCT_FIBER_PAT', 'Conduct Fiber PAT'),
        ('UPLOAD_DRAWING', 'Upload Drawing'),
        ('UPDATE_MASTER_DWG', 'Update Master DWG'),
        ('CLOSE_EVENT', 'Close Event'),
    ]

    name = models.CharField(max_length=50, choices=TASK_CHOICES)
    description = models.TextField()
    assigned_workgroup = models.CharField(max_length=50, choices=User.WORKGROUP_CHOICES)
    area_condition = models.CharField(max_length=20, choices=[('METRO', 'Metro'), ('REGION', 'Region')], null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Project(models.Model):
    name = models.CharField(max_length=200)  # Fixed here
    rtom = models.ForeignKey(RTOM, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, default='PENDING')  # Fixed here
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class TaskAssignment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, default='PENDING')  # Fixed here
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class DummyCredentials:
    ADMIN = {
        'employee_id': 'ADMIN001',
        'password': 'admin123',
        'email': 'admin@slt.lk',
        'workgroup': 'XXX-RTOM'
    }
    
    EMPLOYEE = {
        'employee_id': 'EMP001',
        'password': 'emp123',
        'email': 'employee@slt.lk',
        'workgroup': 'NET-PROJ-ACC-CABLE'
    }
    
    CONTRACTOR = {
        'employee_id': 'CON001',
        'password': 'con123',
        'email': 'contractor@slt.lk',
        'workgroup': 'XXX-MNG-OPMC'
    }

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
    list_display = ('name', 'assigned_workgroup', 'area_condition')
    list_filter = ('assigned_workgroup', 'area_condition')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'rtom', 'status', 'created_at')
    list_filter = ('rtom', 'status')

@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ('project', 'task', 'assigned_to', 'status', 'completed_at')
    list_filter = ('status', 'task', 'assigned_to')

@login_required
def dashboard(request):
    user = request.user
    workgroup = user.workgroup
    
    # Get tasks based on workgroup
    assigned_tasks = TaskAssignment.objects.filter(
        assigned_to=user,
        status='PENDING'
    ).select_related('task', 'project')
    
    context = {
        'workgroup': workgroup,
        'assigned_tasks': assigned_tasks
    }
    
    # Redirect to specific dashboard based on workgroup
    template_name = f'dashboard/{workgroup.lower()}_dashboard.html'
    return render(request, template_name, context)