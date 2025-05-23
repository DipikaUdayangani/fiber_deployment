# apps/accounts/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User  # Change this line
from apps.admin_panel.models import DummyCredentials
import logging

logger = logging.getLogger(__name__)

def login_view(request):
    if request.method == 'POST':
        employee_id = request.POST.get('employee_id')
        user = authenticate(request, username=employee_id, password=request.POST.get('password'))
        
        if user is not None:
            login(request, user)
            logger.debug(f"User logged in - ID: {employee_id}, Workgroup: {user.workgroup}")
            
            if user.workgroup == 'XXX-RTOM':  # Administrator workgroup
                logger.debug(f"Redirecting {employee_id} to admin dashboard")
                return redirect('admin_panel:dashboard')
            elif user.workgroup in ['NET-PROJ-ACC-CABLE', 'XXX-ENG-NW']:  # Employee workgroups
                logger.debug(f"Redirecting {employee_id} to employee dashboard")
                return redirect('employee_panel:dashboard')
            else:  # Contractor workgroups
                logger.debug(f"Redirecting {employee_id} to contractor dashboard")
                return redirect('contractor_panel:dashboard')
        else:
            logger.warning(f"Failed login attempt for employee ID: {employee_id}")
            messages.error(request, 'Invalid credentials')
            
    return render(request, 'accounts/login.html')

def register_view(request):
    if request.method == 'POST':
        try:
            user = User.objects.create_user(
                username=request.POST['employee_id'],
                password=request.POST['password'],
                email=request.POST['email'],
            )
            # Add custom fields to user profile if needed
            user.profile.employee_number = request.POST['employee_id']
            user.profile.workgroup = request.POST['workgroup']
            user.profile.save()
            
            messages.success(request, 'Account created successfully')
            return redirect('accounts:login')
        except Exception as e:
            messages.error(request, str(e))
    return redirect('accounts:login')

def password_reset_view(request):
    if request.method == 'POST':
        employee_id = request.POST.get('employee_id')
        email = request.POST.get('email')
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_new_password')

        if new_password != confirm_password:
            messages.error(request, 'Passwords do not match')
            return redirect('accounts:login')

        try:
            user = User.objects.get(employee_number=employee_id, email=email)
            user.set_password(new_password)
            user.save()
            messages.success(request, 'Password reset successful. Please login with your new password.')
        except User.DoesNotExist:
            messages.error(request, 'Invalid employee ID or email')
        
        return redirect('accounts:login')

    return redirect('accounts:login')

@login_required
def dashboard_view(request):
    if request.user.workgroup == 'XXX-RTOM':
        return redirect('admin_panel:dashboard')
    elif request.user.workgroup in ['NET-PROJ-ACC-CABLE', 'XXX-ENG-NW']:
        return redirect('employee_panel:dashboard')
    else:
        return redirect('contractor_panel:dashboard')

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        messages.success(request, 'You have been successfully logged out.')
        return redirect('accounts:login')
    return redirect('admin_panel:dashboard')
