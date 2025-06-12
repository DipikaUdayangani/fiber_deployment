# apps/accounts/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User  # Change this line
from django.http import JsonResponse
from django.urls import reverse  # Add this import
from apps.admin_panel.models import DummyCredentials, User
import logging

logger = logging.getLogger(__name__)

def login_view(request):
    if request.method == 'POST':
        employee_id = request.POST.get('employee_id')
        password = request.POST.get('password')
        
        logger.debug(f"Login attempt for employee ID: {employee_id}")
        
        try:
            user = User.objects.get(employee_number=employee_id)
            authenticated_user = authenticate(request, username=user.username, password=password)
            
            if authenticated_user is not None:
                login(request, authenticated_user)
                logger.debug(f"User logged in successfully - ID: {employee_id}, Workgroup: {user.workgroup}")
                
                if user.workgroup == 'XXX-RTOM':
                    redirect_url = reverse('admin_panel:dashboard')
                elif user.workgroup in ['NET-PROJ-ACC-CABLE', 'XXX-ENG-NW']:
                    redirect_url = reverse('employee_panel:dashboard')
                else:
                    redirect_url = reverse('contractor_panel:dashboard')
                
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': True,
                        'redirect_url': redirect_url
                    })
                return redirect(redirect_url)
            else:
                error_message = 'Invalid password. Please try again.'
        except User.DoesNotExist:
            error_message = 'Invalid employee ID. Please check your credentials.'
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'error': error_message
            })
        messages.error(request, error_message)
        return render(request, 'accounts/login.html')
    
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
    return redirect(request.META.get('HTTP_REFERER', 'accounts:login'))
