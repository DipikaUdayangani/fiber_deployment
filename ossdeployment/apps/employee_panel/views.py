# apps/employee_panel/views.py

from django.shortcuts import render

def login_view(request):
    return render(request, 'employee_panel/login.html')


def dashboard_view(request):
    return render(request, 'employee_panel/dashboard.html')
