from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from datetime import datetime
from .models import User, Task, Project, TaskAssignment, RTOM

@login_required
def dashboard_view(request):
    if request.user.workgroup != 'XXX-RTOM':
        return redirect('accounts:login')
    
    context = {
        'total_projects': Project.objects.count(),
        'active_projects': Project.objects.filter(status='ACTIVE').count(),
        'completed_projects': Project.objects.filter(status='COMPLETED').count(),
        'on_hold_projects': Project.objects.filter(status='ON_HOLD').count(),
        'total_users': User.objects.count(),
        'online_users': User.objects.filter(is_active=True).count(),
        'active_today': User.objects.filter(last_login__date=datetime.now().date()).count(),
        'total_tasks': Task.objects.count(),
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
    return render(request, 'admin_panel/manage_users.html', {'users': users})

@login_required
def tasks_view(request):
    if request.user.workgroup != 'XXX-RTOM':
        return redirect('accounts:login')
    
    task_assignments = TaskAssignment.objects.select_related(
        'task', 
        'project', 
        'assigned_to',
        'task__rtom'
    ).all()
    
    context = {
        'tasks': task_assignments,
        'total_users': User.objects.count(),
        'active_tasks': task_assignments.filter(status='IN_PROGRESS').count(),
        'pending_tasks': task_assignments.filter(status='PENDING').count(),
        'in_progress_tasks': task_assignments.filter(status='IN_PROGRESS').count(),
        'completed_tasks': task_assignments.filter(status='COMPLETED').count(),
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
    
    return render(request, 'admin_panel/settings.html')
