from django.db import models
from django.contrib.auth.models import User

class WorkGroup(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

class RTOM(models.Model):
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=100)

class EmployeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=50, unique=True)
    workgroup = models.ForeignKey(WorkGroup, on_delete=models.SET_NULL, null=True)
    rtom = models.ForeignKey(RTOM, on_delete=models.SET_NULL, null=True)