# apps/accounts/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User  # Change this line
from django.http import JsonResponse
from django.urls import reverse  # Add this import
from apps.admin_panel.models import DummyCredentials
import logging

logger = logging.getLogger(__name__)

def login_view(request):
    if request.method == 'POST':
        employee_id = request.POST.get('employee_id')
        password = request.POST.get('password')
        user_type = request.POST.get('user_type')
        
        # Log the login attempt
        logger.debug(f"Login attempt for employee ID: {employee_id}, user type: {user_type}")
        
        user = authenticate(request, username=employee_id, password=password)
        
        if user is not None:
            # Validate user type matches the selected type
            is_admin = user.workgroup == 'XXX-RTOM'
            is_employee = user.workgroup in ['NET-PROJ-ACC-CABLE', 'XXX-ENG-NW']
            is_contractor = not (is_admin or is_employee)
            
            selected_type_valid = (
                (user_type == 'administrator' and is_admin) or
                (user_type == 'employee' and is_employee) or
                (user_type == 'contractor' and is_contractor)
            )
            
            if not selected_type_valid:
                error_message = f'Invalid user type selected for your account. Please select the correct user type.'
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return JsonResponse({
                        'success': False,
                        'error': error_message
                    })
                else:
                    messages.error(request, error_message)
                    return render(request, 'accounts/login.html')
            
            login(request, user)
            logger.debug(f"User logged in successfully - ID: {employee_id}, Workgroup: {user.workgroup}")
            
            # Determine redirect URL based on workgroup
            if is_admin:
                redirect_url = reverse('admin_panel:dashboard')
            elif is_employee:
                redirect_url = reverse('employee_panel:dashboard')
            else:  # Contractor
                redirect_url = reverse('contractor_panel:dashboard')
            
            # Check if this is an AJAX request
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'redirect_url': redirect_url
                })
            else:
                return redirect(redirect_url)
        else:
            logger.warning(f"Failed login attempt for employee ID: {employee_id}")
            error_message = 'Invalid credentials. Please check your employee ID and password.'
            
            # Check if this is an AJAX request
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'error': error_message
                })
            else:
                messages.error(request, error_message)
                return render(request, 'accounts/login.html')
    
    # GET request - show login form
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
