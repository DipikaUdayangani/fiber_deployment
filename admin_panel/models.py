from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class Workgroup(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def _str_(self):
        return self.name

class Task(models.Model):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    assigned_workgroup = models.ForeignKey(Workgroup, on_delete=models.CASCADE, related_name='tasks')
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def _str_(self):
        return self.title

class TaskAssignment(models.Model):
    created_by  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task_assignments')
    assigned_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    def _str_(self):
        return f"{self.user.username} - {self.task.title}"
    
class UserManager(BaseUserManager):
    def create_user(self, full_name, employee_id, email, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(full_name=full_name, employee_id=employee_id, email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    full_name = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'employee_id']

    objects = UserManager()

    def __str__(self):
        return self.username

class PasswordReset(models.Model):
    employee_id = models.ForeignKey(User, on_delete=models.CASCADE, to_field='employee_id')
    email = models.EmailField()
    reset_token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class Project(models.Model):
    project_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.project_name
    
    
    

class CustomUser(AbstractUser):
    # Add your custom fields here
    full_name = models.CharField(max_length=255)
    employee_id = models.CharField(max_length=50, unique=True)
    workgroup = models.ForeignKey('Workgroup', on_delete=models.SET_NULL, null=True, blank=True)

    # Fix the conflicting reverse accessors
    groups = models.ManyToManyField(
        'auth.Group',
        related_name="customuser_groups",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name="customuser_permissions",
        blank=True
    )

    def __str__(self):
        return self.username
    