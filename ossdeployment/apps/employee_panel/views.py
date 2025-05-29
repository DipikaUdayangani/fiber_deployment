# apps/employee_panel/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def login_view(request):
    return render(request, 'employee_panel/login.html')


@login_required
def dashboard_view(request):
    return render(request, 'employee_panel/dashboard.html', {
        'active_tab': 'dashboard'
    })

@login_required
def projects_view(request):
    return render(request, 'employee_panel/projects.html', {
        'active_tab': 'projects'
    })

@login_required
def tasks_view(request):
    return render(request, 'employee_panel/tasks.html', {
        'active_tab': 'tasks'
    })

@login_required
def profile_view(request):
    return render(request, 'employee_panel/profile.html', {
        'active_tab': 'profile'
    })
