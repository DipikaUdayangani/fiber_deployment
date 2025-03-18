from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from admin_panel.models import Task, Workgroup, TaskAssignment
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import LoginForm

def user_login(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect('dashboard')
            else:
                return render(request, 'login.html', {'form': form, 'error': 'Invalid Credentials'})

    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

@login_required
def user_dashboard(request):
    """User dashboard showing all tasks assigned to the user"""
    # Get tasks assigned to the current user
    user_tasks = TaskAssignment.objects.filter(user=request.user)
    
    context = {
        'user_tasks': user_tasks,
        'total_tasks': user_tasks.count(),
        'completed_tasks': user_tasks.filter(completed_at__isnull=False).count(),
        'pending_tasks': user_tasks.filter(completed_at__isnull=True).count(),
    }
    return render(request, 'user_panel/dashboard.html', context)

@login_required
def task_list(request):
    """View all tasks visible to the user"""
    # Get all tasks assigned to the user
    user_task_assignments = TaskAssignment.objects.filter(user=request.user)
    user_tasks = [assignment.task for assignment in user_task_assignments]
    
    # Get all tasks for workgroups the user belongs to
    user_workgroups = Workgroup.objects.filter(members=request.user)
    workgroup_tasks = Task.objects.filter(assigned_workgroup__in=user_workgroups)
    
    # Combine both sets of tasks
    all_tasks = list(set(user_tasks + list(workgroup_tasks)))
    
    context = {
        'tasks': all_tasks,
    }
    return render(request, 'user/task_list.html', context)

@login_required
def task_detail(request, task_id):
    """View detailed information about a specific task including attachments"""
    # Get the task if it's assigned to the user or their workgroup
    user_workgroups = Workgroup.objects.filter(members=request.user)
    task = get_object_or_404(
        Task, 
        id=task_id,
        assigned_workgroup__in=user_workgroups
    )
    
    # Get task assignments for this task
    assignments = TaskAssignment.objects.filter(task=task)
    
    context = {
        'task': task,
        'assignments': assignments,
        # Add attachments if you have a model for them
        # 'attachments': TaskAttachment.objects.filter(task=task),
    }
    return render(request, 'user/task.html', context)

@login_required
def project_list(request):
    """View all projects (workgroups) the user is part of"""
    user_workgroups = Workgroup.objects.filter(members=request.user)
    
    context = {
        'workgroups': user_workgroups,
    }
    return render(request, 'user/project_list.html', context)

@login_required
def project_detail(request, project_id):
    """View detailed information about a specific project"""
    project = get_object_or_404(Workgroup, id=project_id, members=request.user)
    project_tasks = Task.objects.filter(assigned_workgroup=project)
    
    context = {
        'project': project,
        'tasks': project_tasks,
    }
    return render(request, 'user/project_detail.html', context)

def user_logout(request):
    logout(request)
    return redirect('login')

@login_required
def user_tasks(request):
    """Display all tasks for the user"""
    # Get assigned tasks for the user
    user_task_assignments = TaskAssignment.objects.filter(user=request.user)
    assigned_tasks = [assignment.task for assignment in user_task_assignments]
    
    # Get tasks from workgroups they belong to
    user_workgroups = Workgroup.objects.filter(members=request.user)
    workgroup_tasks = Task.objects.filter(assigned_workgroup__in=user_workgroups)
    
    # Combine and remove duplicates
    all_tasks = list(set(assigned_tasks + list(workgroup_tasks)))
    
    # Get all projects for the filter dropdown
    projects = Workgroup.objects.filter(members=request.user)
    
    context = {
        'tasks': all_tasks,
        'projects': projects
    }
    return render(request, 'user_panel/task.html', context)