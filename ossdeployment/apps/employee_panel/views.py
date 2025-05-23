# apps/employee_panel/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def login_view(request):
    return render(request, 'employee_panel/login.html')


@login_required
def dashboard_view(request):
    return render(request, 'employee_panel/dashboard.html', {
        'active_tab': 'home'
    })
