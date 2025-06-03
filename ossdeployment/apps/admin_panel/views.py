from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from datetime import datetime
from django.utils import timezone
from .models import User, Task, Project, TaskAssignment, RTOM, Workgroup  # Added Workgroup
import json
import logging

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

@login_required
@require_http_methods(["GET"])
def get_projects(request):
    try:
        logger.info("Fetching all projects")
        projects = Project.objects.select_related('rtom').all()
        logger.info(f"Found {projects.count()} projects")
        
        projects_data = []
        for project in projects:
            try:
                # Handle potential None values and type conversions
                budget = None
                if project.budget is not None:
                    try:
                        budget = float(project.budget)
                    except (TypeError, ValueError):
                        logger.warning(f"Could not convert budget to float for project {project.id}")
                
                project_dict = {
                    'id': project.id,
                    'name': project.name or '',
                    'location': project.location or '',
                    'startDate': project.start_date.isoformat() if project.start_date else None,
                    'endDate': project.end_date.isoformat() if project.end_date else None,
                    'status': project.status or 'Active',
                    'budget': budget,
                    'description': project.description or '',
                    'progress': project.progress or 0,
                    'rtom': {
                        'id': project.rtom.id,
                        'name': project.rtom.name,
                        'code': project.rtom.code
                    } if project.rtom else None
                }
                projects_data.append(project_dict)
            except Exception as e:
                logger.error(f"Error processing project {project.id}: {str(e)}", exc_info=True)
                continue
        
        logger.info("Successfully processed all projects")
        return JsonResponse(projects_data, safe=False)
    except Exception as e:
        logger.error(f"Error in get_projects: {str(e)}", exc_info=True)
        return JsonResponse({
            'error': str(e),
            'detail': 'An error occurred while fetching projects. Please check the server logs for more details.'
        }, status=500)

@login_required
@require_http_methods(["POST"])
def create_project(request):
    try:
        data = json.loads(request.body)
        logger.info(f"Creating new project with data: {data}")
        
        # Validate required fields
        required_fields = ['name', 'location', 'rtom']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return JsonResponse({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=400)
        
        # Validate RTOM exists
        try:
            rtom = RTOM.objects.get(id=data['rtom'])
        except RTOM.DoesNotExist:
            return JsonResponse({
                'error': f'RTOM with id {data["rtom"]} does not exist'
            }, status=400)
        
        project = Project.objects.create(
            name=data['name'],
            location=data['location'],
            rtom=rtom,
            start_date=data.get('startDate'),
            end_date=data.get('endDate'),
            status=data.get('status', 'Active'),
            budget=data.get('budget'),
            description=data.get('description', '')
        )
        
        logger.info(f"Successfully created project {project.id}")
        return JsonResponse({
            'id': project.id,
            'name': project.name,
            'location': project.location,
            'startDate': project.start_date.isoformat() if project.start_date else None,
            'endDate': project.end_date.isoformat() if project.end_date else None,
            'status': project.status,
            'budget': float(project.budget) if project.budget else None,
            'description': project.description,
            'progress': project.progress,
            'rtom': {
                'id': project.rtom.id,
                'name': project.rtom.name,
                'code': project.rtom.code
            }
        })
    except json.JSONDecodeError:
        logger.error("Invalid JSON data received")
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        logger.error(f"Error creating project: {str(e)}", exc_info=True)
        return JsonResponse({'error': str(e)}, status=400)

@login_required
@require_http_methods(["PUT"])
def update_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
        data = json.loads(request.body)
        
        project.name = data['name']
        project.location = data['location']
        project.start_date = data.get('startDate')
        project.end_date = data.get('endDate')
        project.status = data['status']
        project.budget = data.get('budget')
        project.description = data.get('description', '')
        if 'rtom' in data:
            project.rtom_id = data['rtom']
        
        project.save()
        return JsonResponse({
            'id': project.id,
            'name': project.name,
            'location': project.location,
            'startDate': project.start_date.isoformat() if project.start_date else None,
            'endDate': project.end_date.isoformat() if project.end_date else None,
            'status': project.status,
            'budget': float(project.budget) if project.budget else None,
            'description': project.description,
            'progress': project.progress
        })
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@login_required
@require_http_methods(["DELETE"])
def delete_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id)
        project.delete()
        return JsonResponse({'message': 'Project deleted successfully'})
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
