from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout

@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

@login_required
def add_user(request):
    return render(request, 'add_user.html')

@login_required
def manage_users(request):
    return render(request, 'manage_users.html')

@login_required
def tasks(request):
    return render(request, 'tasks.html')

@login_required
def workgroups(request):
    return render(request, 'workgroups.html')

@login_required
def settings(request):
    return render(request, 'settings.html')