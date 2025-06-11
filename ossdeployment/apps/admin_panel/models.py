from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.utils import timezone

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

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('SUSPENDED', 'Suspended'),
    ]

    # Required fields
    employee_number = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    workgroup = models.CharField(max_length=50, choices=WORKGROUP_CHOICES)
    rtom = models.ForeignKey('RTOM', on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    # Optional fields
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True, db_index=True)
    last_activity = models.DateTimeField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'admin_panel_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['employee_number']),
            models.Index(fields=['email']),
            models.Index(fields=['workgroup']),
            models.Index(fields=['status']),
            models.Index(fields=['date_joined']),
        ]

    def save(self, *args, **kwargs):
        if not self.employee_number:
            self.employee_number = self.username
        if not self.username:
            self.username = self.employee_number
        super().save(*args, **kwargs)

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username

    def get_status_display(self):
        return dict(self.STATUS_CHOICES).get(self.status, self.status)

    def get_workgroup_display(self):
        return dict(self.WORKGROUP_CHOICES).get(self.workgroup, self.workgroup)

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
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed')
    ]

    AREA_CONDITION_CHOICES = [
        ('METRO', 'Metro'),
        ('REGION', 'Region'),
        ('URBAN', 'Urban'),
        ('RURAL', 'Rural')
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    assigned_workgroup = models.CharField(max_length=50, choices=User.WORKGROUP_CHOICES)
    area_condition = models.CharField(max_length=20, choices=AREA_CONDITION_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    rtom = models.ForeignKey('RTOM', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    attachment = models.FileField(upload_to='task_attachments/')

    def __str__(self):
        return self.name

class Project(models.Model):
    project_name = models.CharField(max_length=200)
    project_no = models.CharField(max_length=50, unique=True)
    slt_ref_no = models.CharField(max_length=50)
    pe_no = models.CharField(max_length=50)
    contract_no = models.CharField(max_length=50)
    invoice = models.CharField(max_length=50)
    starting_date = models.DateField()
    description = models.TextField()
    attachment = models.FileField(upload_to='project_attachments/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project_name} ({self.project_no})"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

class TaskAssignment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed')
    ]

    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.task.name} - {self.assigned_to.employee_number}"

    def save(self, *args, **kwargs):
        if self.status == 'COMPLETED' and not self.completed_at:
            self.completed_at = timezone.now()
        super().save(*args, **kwargs)

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

class Workgroup(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class UserActivity(models.Model):
    ACTIVITY_TYPES = [
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('VIEW', 'View'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    related_object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object_type = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        verbose_name = 'User Activity'
        verbose_name_plural = 'User Activities'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.activity_type} - {self.created_at}"

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, RTOM, Task, Project, TaskAssignment

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