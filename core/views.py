from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.core.mail import send_mail
from .models import Workgroup, Task, TaskAssignment
from .forms import LoginForm, RegistrationForm
from django.contrib.auth.hashers import make_password

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            employee_id = form.cleaned_data.get('employee_id')
            password = form.cleaned_data.get('password')
            
            # Use employee_id as username for authentication
            user = authenticate(username=employee_id, password=password)
            
            if user is not None:
                login(request, user)
                messages.success(request, "Login successful")
                return redirect('dashboard')
            else:
                messages.error(request, "Invalid credentials")
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def register_view(request):
    if request.method == "POST":
        form = RegistrationForm(request.POST)  # Corrected the assignment syntax
    if form.is_valid():
        user = form.save()
        login(request, user)
        return redirect('login')
    else:
        form = RegistrationForm()
    return render(request, 'accounts/signup.html', {'form': form})


@require_POST
def logout_view(request):
    try:
        logout(request)
        return JsonResponse({'status': 'success', 'message': 'Logged out successfully'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

@login_required
def settings(request):
    return render(request, 'settings.html')

def password_reset_request(request):
    if request.method == "POST":
        email = request.POST.get("email")
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = request.build_absolute_uri(
                f'/password-reset/confirm/{uid}/{token}/'
            )
            
            email_subject = "Password Reset Requested"
            email_body = render_to_string('password_reset_email.html', {
                'user': user,
                'reset_link': reset_link,
            })
            
            send_mail(
                subject=email_subject,
                message=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=email_body,
            )
            messages.success(request, "Password reset link has been sent to your email")
        except User.DoesNotExist:
            messages.error(request, "No user with that email address exists")
    
    return render(request, 'password_reset_request.html')

def password_reset_confirm(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
        
        if user is not None and default_token_generator.check_token(user, token):
            if request.method == 'POST':
                password = request.POST.get('password')
                confirm_password = request.POST.get('confirm_password')
                
                if password == confirm_password:
                    user.password = make_password(password)
                    user.save()
                    messages.success(request, "Password has been reset successfully")
                    return redirect('login')
                else:
                    messages.error(request, "Passwords do not match")
            
            return render(request, 'password_reset_confirm.html')
        else:
            messages.error(request, "The reset link is invalid or has expired")
            return redirect('password_reset')
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        messages.error(request, "Invalid password reset link")
        return redirect('password_reset')

@login_required
def add_user(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "User added successfully")
            return redirect('manage_users')
    else:
        form = RegistrationForm()
    return render(request, 'add_user.html', {'form': form})

@login_required
def manage_users(request):
    users = User.objects.all()
    return render(request, 'manage_users.html', {'users': users})

@login_required
def tasks(request):
    user_tasks = TaskAssignment.objects.filter(user=request.user)
    created_tasks = Task.objects.filter(created_by=request.user)
    context = {
        'user_tasks': user_tasks,
        'created_tasks': created_tasks
    }
    return render(request, 'tasks.html', context)


def admin_login_view(request):
    # Your login logic here
    from django.shortcuts import render, redirect
    # Basic implementation - replace with your actual login logic
    return render(request, 'admin/login.html')

