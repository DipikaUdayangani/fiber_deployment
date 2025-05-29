# apps/employee_panel/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def login_view(request):
    return render(request, 'employee_panel/login.html')


@login_required
def dashboard_view(request):
    return render(request, 'employee_panel/dashboard.html')

@login_required
def projects_view(request):
    return render(request, 'employee_panel/projects.html')

@login_required
def tasks_view(request):
    return render(request, 'employee_panel/tasks.html')

@login_required
def profile_view(request):
    # In a real application, fetch logged-in user's profile data
    context = {
        'user': request.user # Example of passing user object
    }
    return render(request, 'employee_panel/profile.html', context)
