from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from datetime import datetime
from django.utils import timezone
from .models import User, Task, Project, TaskAssignment, RTOM, Workgroup  # Added Workgroup
import json
import logging
from django.core.exceptions import ValidationError

# Set up logging
logger = logging.getLogger(__name__)

@login_required
def dashboard_view(request):
    current_time = timezone.now()
    # Consider users active if they logged in within the last 15 minutes
    active_threshold = current_time - timezone.timedelta(minutes=15)
    
    # Get task assignments for status counts
    task_assignments = TaskAssignment.objects.all()
    
    context = {
        'total_projects': Project.objects.count(),
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
    # Get all tasks with their assignments
    tasks = Task.objects.all().order_by('-created_at')
    task_assignments = TaskAssignment.objects.select_related('assigned_to', 'task').all()
    
    # Create a dictionary to map task IDs to their assignments
    task_assignments_dict = {ta.task_id: ta for ta in task_assignments}
    
    # Get other required data
    users = User.objects.all()
    workgroups = Workgroup.objects.all()
    rtoms = RTOM.objects.all()
    
    # Prepare tasks with assignment data
    tasks_with_assignments = []
    for task in tasks:
        assignment = task_assignments_dict.get(task.id)
        task_data = {
            'id': task.id,
            'name': task.name,
            'assigned_to': assignment.assigned_to if assignment else None,
            'assigned_workgroup': task.assigned_workgroup,
            'rtom': task.rtom,
            'deadline': task.updated_at,  # Using updated_at as deadline for now
            'status': assignment.status if assignment else task.status,
            'attachment': task.attachment
        }
        tasks_with_assignments.append(task_data)
    
    context = {
        'tasks': tasks_with_assignments,
        'users': users,
        'workgroups': workgroups,
        'rtoms': rtoms,
        'total_tasks': tasks.count(),
        'pending_tasks': task_assignments.filter(status='PENDING').count(),
        'in_progress_tasks': task_assignments.filter(status='IN_PROGRESS').count(),
        'completed_tasks': task_assignments.filter(status='COMPLETED').count(),
        'total_users': User.objects.count(),
        'active_tasks': task_assignments.exclude(status='COMPLETED').count(),
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

@login_required
def projects_view(request):
    rtoms = RTOM.objects.all().order_by('name')
    return render(request, 'admin_panel/projects.html', {
        'active_tab': 'projects',
        'rtoms': rtoms
    })

@require_http_methods(["GET"])
def get_projects(request):
    try:
        projects = Project.objects.all().values(
            'id', 'project_name', 'project_no', 'slt_ref_no', 
            'pe_no', 'contract_no', 'invoice', 'starting_date',
            'description'
        )
        projects_list = list(projects)
        for project in projects_list:
            # Convert date to string format
            if project['starting_date']:
                project['starting_date'] = project['starting_date'].strftime('%Y-%m-%d')
            # Add default values for frontend
            project['status'] = 'Active'  # Default status
            project['budget'] = 0  # Default budget
            
        print("Projects data being sent:", projects_list)  # Debug log
        return JsonResponse({'projects': projects_list})
    except Exception as e:
        print("Error in get_projects:", str(e))  # Debug log
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["POST"])
def create_project(request):
    try:
        data = json.loads(request.body)
        
        # Create new project
        project = Project(
            project_name=data['project_name'],
            project_no=data['project_no'],
            slt_ref_no=data['slt_ref_no'],
            pe_no=data.get('pe_no'),
            contract_no=data['contract_no'],
            invoice=data.get('invoice'),
            starting_date=data['starting_date'],
            description=data.get('description')
        )
        
        # Handle file upload if present
        if 'attachment' in request.FILES:
            project.attachment = request.FILES['attachment']
        
        project.save()
        
        return JsonResponse({
            'message': 'Project created successfully',
            'project': {
                'id': project.id,
                'project_name': project.project_name,
                'project_no': project.project_no,
                'slt_ref_no': project.slt_ref_no,
                'pe_no': project.pe_no,
                'contract_no': project.contract_no,
                'invoice': project.invoice,
                'starting_date': project.starting_date.strftime('%Y-%m-%d'),
                'description': project.description
            }
        })
    except ValidationError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def get_project_count(request):
    try:
        count = Project.objects.count()
        return JsonResponse({'count': count})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def get_project_details(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
        return JsonResponse({
            'project': {
                'id': project.id,
                'project_name': project.project_name,
                'project_no': project.project_no,
                'slt_ref_no': project.slt_ref_no,
                'pe_no': project.pe_no,
                'contract_no': project.contract_no,
                'invoice': project.invoice,
                'starting_date': project.starting_date.strftime('%Y-%m-%d'),
                'description': project.description,
                'attachment_url': project.attachment.url if project.attachment else None
            }
        })
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["PUT"])
def update_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
        data = json.loads(request.body)
        
        # Update project fields
        project.project_name = data['project_name']
        project.project_no = data['project_no']
        project.slt_ref_no = data['slt_ref_no']
        project.pe_no = data.get('pe_no')
        project.contract_no = data['contract_no']
        project.invoice = data.get('invoice')
        project.starting_date = data['starting_date']
        project.description = data.get('description')
        
        # Handle file upload if present
        if 'attachment' in request.FILES:
            project.attachment = request.FILES['attachment']
        
        project.save()
        
        return JsonResponse({
            'message': 'Project updated successfully',
            'project': {
                'id': project.id,
                'project_name': project.project_name,
                'project_no': project.project_no,
                'slt_ref_no': project.slt_ref_no,
                'pe_no': project.pe_no,
                'contract_no': project.contract_no,
                'invoice': project.invoice,
                'starting_date': project.starting_date.strftime('%Y-%m-%d'),
                'description': project.description
            }
        })
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except ValidationError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["DELETE"])
def delete_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
        project.delete()
        return JsonResponse({'message': 'Project deleted successfully'})
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
@require_http_methods(["GET"])
def get_tasks(request):
    tasks = Task.objects.all().order_by('-created_at')
    task_assignments = TaskAssignment.objects.select_related('assigned_to', 'task', 'project').all()
    
    # Create a dictionary to map task IDs to their assignments
    task_assignments_dict = {ta.task_id: ta for ta in task_assignments}
    
    tasks_data = []
    for task in tasks:
        assignment = task_assignments_dict.get(task.id)
        task_data = {
            'id': task.id,
            'name': task.name,
            'assigned_to': assignment.assigned_to.employee_number if assignment and assignment.assigned_to else None,
            'assigned_to_name': assignment.assigned_to.get_full_name() if assignment and assignment.assigned_to else None,
            'project': assignment.project.project_name if assignment and assignment.project else None,
            'project_id': assignment.project.id if assignment and assignment.project else None,
            'workgroup': task.assigned_workgroup,
            'rtom': task.rtom.name if task.rtom else None,
            'rtom_id': task.rtom.id if task.rtom else None,
            'deadline': assignment.completed_at.strftime('%Y-%m-%d') if assignment and assignment.completed_at else None,
            'status': assignment.status if assignment else task.status,
            'attachment': task.attachment.url if task.attachment else None
        }
        tasks_data.append(task_data)
    
    return JsonResponse({'tasks': tasks_data})

@login_required
@require_http_methods(["POST"])
def create_task(request):
    try:
        data = json.loads(request.body)
        
        # Create the task
        task = Task.objects.create(
            name=data['name'],
            description=data.get('description', ''),
            assigned_workgroup=data['workgroup'],
            area_condition=data.get('area_condition', ''),
            rtom_id=data.get('rtom_id')
        )
        
        # Create the task assignment
        TaskAssignment.objects.create(
            task=task,
            project_id=data['project_id'],
            assigned_to_id=data['assigned_to_id'],
            status='PENDING'
        )
        
        return JsonResponse({
            'status': 'success',
            'message': 'Task created successfully',
            'task_id': task.id
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)

@login_required
@require_http_methods(["GET"])
def get_task_details(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    assignment = TaskAssignment.objects.filter(task=task).select_related('assigned_to', 'project').first()
    
    task_data = {
        'id': task.id,
        'name': task.name,
        'description': task.description,
        'assigned_to_id': assignment.assigned_to.id if assignment and assignment.assigned_to else None,
        'assigned_to_name': assignment.assigned_to.get_full_name() if assignment and assignment.assigned_to else None,
        'project_id': assignment.project.id if assignment and assignment.project else None,
        'project_name': assignment.project.project_name if assignment and assignment.project else None,
        'workgroup': task.assigned_workgroup,
        'rtom_id': task.rtom.id if task.rtom else None,
        'rtom_name': task.rtom.name if task.rtom else None,
        'deadline': assignment.completed_at.strftime('%Y-%m-%d') if assignment and assignment.completed_at else None,
        'status': assignment.status if assignment else task.status,
        'attachment': task.attachment.url if task.attachment else None
    }
    
    return JsonResponse(task_data)

@login_required
@require_http_methods(["POST"])
def update_task(request, task_id):
    try:
        task = get_object_or_404(Task, id=task_id)
        data = json.loads(request.body)
        
        # Update task fields
        task.name = data['name']
        task.description = data.get('description', task.description)
        task.assigned_workgroup = data['workgroup']
        task.rtom_id = data.get('rtom_id')
        if 'attachment' in request.FILES:
            task.attachment = request.FILES['attachment']
        task.save()
        
        # Update task assignment
        assignment = TaskAssignment.objects.get(task=task)
        assignment.project_id = data['project_id']
        assignment.assigned_to_id = data['assigned_to_id']
        assignment.status = data.get('status', assignment.status)
        if 'deadline' in data:
            assignment.completed_at = datetime.strptime(data['deadline'], '%Y-%m-%d')
        assignment.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Task updated successfully'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)

@login_required
@require_http_methods(["POST"])
def delete_task(request, task_id):
    try:
        task = get_object_or_404(Task, id=task_id)
        task.delete()  # This will also delete the associated TaskAssignment due to CASCADE
        return JsonResponse({
            'status': 'success',
            'message': 'Task deleted successfully'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)
