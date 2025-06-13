# apps/employee_panel/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Q, Count, F, Case, When, Value, CharField
from apps.admin_panel.models import Project, Task, TaskAssignment, User
from django.utils import timezone
import json

@login_required
def dashboard_view(request):
    """Employee dashboard view showing summary statistics."""
    user = request.user
    
    # Get projects assigned to user's workgroup through task assignments
    assigned_projects = Project.objects.filter(
        taskassignment__task__assigned_workgroup=user.workgroup
    ).distinct().annotate(
        total_tasks=Count('taskassignment__task', distinct=True),
        completed_tasks=Count(
            'taskassignment__task',
            filter=Q(taskassignment__status='COMPLETED'),
            distinct=True
        ),
        in_progress_tasks=Count(
            'taskassignment__task',
            filter=Q(taskassignment__status='IN_PROGRESS'),
            distinct=True
        )
    )
    
    # Calculate project statistics
    total_projects = assigned_projects.count()
    completed_projects = assigned_projects.filter(total_tasks=F('completed_tasks')).count()
    in_progress_projects = assigned_projects.filter(in_progress_tasks__gt=0).count()
    
    context = {
        'total_projects': total_projects,
        'completed_projects': completed_projects,
        'in_progress_projects': in_progress_projects,
    }
    
    return render(request, 'employee_panel/dashboard.html', context)

@login_required
def projects_view(request):
    """View showing projects assigned to the employee's workgroup."""
    user = request.user
    
    # Get projects assigned to user's workgroup through task assignments
    assigned_projects = Project.objects.filter(
        taskassignment__task__assigned_workgroup=user.workgroup
    ).distinct().annotate(
        total_tasks=Count('taskassignment__task', distinct=True),
        completed_tasks=Count(
            'taskassignment__task',
            filter=Q(taskassignment__status='COMPLETED'),
            distinct=True
        ),
        pending_tasks=Count(
            'taskassignment__task',
            filter=Q(taskassignment__status='PENDING'),
            distinct=True
        ),
        in_progress_tasks=Count(
            'taskassignment__task',
            filter=Q(taskassignment__status='IN_PROGRESS'),
            distinct=True
        )
    ).order_by('-starting_date')
    
    # Prepare project data for template
    projects_data = []
    for project in assigned_projects:
        project_data = {
            'id': project.id,
            'project_name': project.project_name,
            'project_no': project.project_no,
            'pe_no': project.pe_no,
            'contract_no': project.contract_no,
            'status': project.status,
            'total_tasks': project.total_tasks,
            'completed_tasks': project.completed_tasks,
            'pending_tasks': project.pending_tasks,
            'in_progress_tasks': project.in_progress_tasks,
        }
        projects_data.append(project_data)
    
    context = {
        'projects': projects_data,
    }
    
    return render(request, 'employee_panel/projects.html', context)

@login_required
def tasks_view(request):
    """View showing tasks assigned to the employee's workgroup."""
    user = request.user
    
    # Get tasks assigned to user's workgroup
    assigned_tasks = Task.objects.filter(
        assigned_workgroup=user.workgroup
    ).select_related('project').order_by('-created_at')
    
    context = {
        'tasks': assigned_tasks,
    }
    
    return render(request, 'employee_panel/tasks.html', context)

@login_required
def profile_view(request):
    """View for employee profile management."""
    user = request.user
    context = {
        'user': user,
    }
    return render(request, 'employee_panel/profile.html', context)

@login_required
@require_http_methods(['GET'])
def get_tasks(request):
    """API endpoint to get tasks for the current user's workgroup."""
    user = request.user
    
    tasks = Task.objects.filter(
        assigned_workgroup=user.workgroup
    ).select_related('project').order_by('-created_at')
    
    tasks_data = [{
        'id': task.id,
        'name': task.name,
        'description': task.description,
        'project': task.project.project_name if task.project else None,
        'status': task.status,
        'assigned_workgroup': task.assigned_workgroup,
        'created_at': task.created_at.isoformat(),
    } for task in tasks]
    
    return JsonResponse({'tasks': tasks_data})

@login_required
@require_http_methods(['POST'])
def upload_task_document(request, task_id):
    """API endpoint to upload documents for a task."""
    try:
        task = Task.objects.get(
            id=task_id,
            assigned_workgroup=request.user.workgroup
        )
        
        if 'document' not in request.FILES:
            return JsonResponse({
                'success': False,
                'error': 'No document file provided'
            }, status=400)
        
        document = request.FILES['document']
        # Handle document upload logic here
        # You'll need to implement the actual file storage logic
        
        return JsonResponse({
            'success': True,
            'message': 'Document uploaded successfully'
        })
        
    except Task.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Task not found or not assigned to your workgroup'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)