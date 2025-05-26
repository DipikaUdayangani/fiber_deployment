from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from datetime import datetime
from django.utils import timezone
from .models import User, Task, Project, TaskAssignment, RTOM, Workgroup  # Added Workgroup

@login_required
def dashboard_view(request):
    current_time = timezone.now()
    # Consider users active if they logged in within the last 15 minutes
    active_threshold = current_time - timezone.timedelta(minutes=15)
    
    # Get task assignments for status counts
    task_assignments = TaskAssignment.objects.all()
    
    context = {
        'total_projects': Project.objects.count(),
        'active_projects': Project.objects.filter(status='ACTIVE').count(),
        'completed_projects': Project.objects.filter(status='COMPLETED').count(),
        'on_hold_projects': Project.objects.filter(status='ON_HOLD').count(),
        'total_users': User.objects.count(),
        'online_users': User.objects.filter(last_login__gte=active_threshold).count(),
        'active_today': User.objects.filter(last_login__date=current_time.date()).count(),
        'total_tasks': Task.objects.count(),
        'pending_tasks': task_assignments.filter(status='PENDING').count(),
        'in_progress_tasks': task_assignments.filter(status='IN_PROGRESS').count(),
        'completed_tasks': task_assignments.filter(status='COMPLETED').count(),
        'active_tab': 'home'
    }
    return render(request, 'admin_panel/dashboard.html', context)

@login_required
def add_user_view(request):
    if request.user.workgroup != 'XXX-RTOM':
        return redirect('accounts:login')
        
    if request.method == 'POST':
        try:
            User.objects.create_user(
                username=request.POST['employee_id'],
                password=request.POST['password'],
                email=request.POST['email'],
                employee_number=request.POST['employee_id'],
                workgroup=request.POST['workgroup']
            )
            messages.success(request, 'User created successfully')
            return redirect('admin_panel:manage_users')
        except Exception as e:
            messages.error(request, str(e))
    
    return render(request, 'admin_panel/add_user.html')

@login_required
def manage_users_view(request):
    if request.user.workgroup != 'XXX-RTOM':
        return redirect('accounts:login')
    
    users = User.objects.all().exclude(id=request.user.id)
    return render(request, 'admin_panel/manage_users.html', {'users': users, 'active_tab': 'users'})

@login_required
def tasks_view(request):
    tasks = Task.objects.all().order_by('-created_at')
    users = User.objects.all()
    workgroups = Workgroup.objects.all()
    rtoms = RTOM.objects.all()
    
    context = {
        'tasks': tasks,
        'users': users,
        'workgroups': workgroups,
        'rtoms': rtoms,
        'total_tasks': tasks.count(),
        'pending_tasks': tasks.filter(status='PENDING').count(),
        'in_progress_tasks': tasks.filter(status='IN_PROGRESS').count(),
        'completed_tasks': tasks.filter(status='COMPLETED').count(),
        'total_users': User.objects.count(),
        'active_tasks': tasks.exclude(status='COMPLETED').count(),
        'active_tab': 'tasks'
    }
    
    return render(request, 'admin_panel/tasks.html', context)

@login_required
def workgroups_view(request):
    if request.user.workgroup != 'XXX-RTOM':
        return redirect('accounts:login')
    
    return render(request, 'admin_panel/workgroups.html')

@login_required
def settings_view(request):
    if request.user.workgroup != 'XXX-RTOM':
        return redirect('accounts:login')
    
    return render(request, 'admin_panel/settings.html', {'active_tab': 'settings'})

@login_required
def profile_view(request):
    return render(request, 'admin_panel/profile.html', {
        'active_tab': 'profile'
    })

@login_required
@require_http_methods(["POST"])
def add_user(request):
    try:
        employee_id = request.POST.get('employee_id')
        email = request.POST.get('email')
        workgroup = request.POST.get('workgroup')
        rtom = request.POST.get('rtom')

        # Validate required fields
        if not all([employee_id, email, workgroup, rtom]):
            return JsonResponse({
                'success': False,
                'error': 'All fields are required'
            })

        # Check if user already exists
        if User.objects.filter(employee_number=employee_id).exists():
            return JsonResponse({
                'success': False,
                'error': 'Employee ID already exists'
            })

        # Create new user
        user = User.objects.create(
            employee_number=employee_id,
            email=email,
            workgroup=workgroup,
            rtom=rtom
        )

        return JsonResponse({
            'success': True,
            'message': 'User added successfully'
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })
