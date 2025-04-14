# apps/accounts/views.py

from django.shortcuts import render, redirect

def login_view(request):
    return render(request, 'accounts/login.html')

def logout_view(request):
    # Add logout logic
    return redirect('login')

def register_view(request):
    return render(request, 'accounts/register.html')
