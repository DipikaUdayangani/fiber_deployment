from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from datetime import datetime
from django.utils import timezone
from .models import User, Task, Project, TaskAssignment, RTOM, Workgroup, UserActivity  # Added UserActivity
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
    
    users = User.objects.all().exclude(id=request.user.id).select_related('rtom')
    rtoms = RTOM.objects.all()
    workgroups = Workgroup.objects.all()
    
    context = {
        'users': users,
        'rtoms': rtoms,
        'workgroups': workgroups,
        'active_tab': 'users',
        'status_choices': User.STATUS_CHOICES,
        'workgroup_choices': User.WORKGROUP_CHOICES
    }
    return render(request, 'admin_panel/manage_users.html', context)

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
        print("Received request to add user")
        print("Request body:", request.body)
        data = json.loads(request.body)
        print("Parsed data:", data)
        
        employee_id = data.get('employee_id')
        email = data.get('email')
        password = data.get('password', 'default123')  # Default password if not provided
        workgroup = data.get('workgroup')
        rtom_id = data.get('rtom')
        name = data.get('name', '').split(' ', 1)  # Split name into first and last name
        first_name = name[0] if len(name) > 0 else ''
        last_name = name[1] if len(name) > 1 else ''

        print("Extracted fields:", {
            'employee_id': employee_id,
            'email': email,
            'workgroup': workgroup,
            'rtom_id': rtom_id,
            'first_name': first_name,
            'last_name': last_name
        })

        # Validate required fields
        if not all([employee_id, email, workgroup, rtom_id]):
            missing_fields = [field for field, value in {
                'employee_id': employee_id,
                'email': email,
                'workgroup': workgroup,
                'rtom_id': rtom_id
            }.items() if not value]
            print("Missing required fields:", missing_fields)
            return JsonResponse({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=400)

        # Check if user already exists
        if User.objects.filter(employee_number=employee_id).exists():
            print("User with employee_id already exists:", employee_id)
            return JsonResponse({
                'success': False,
                'error': 'Employee ID already exists'
            }, status=400)

        if User.objects.filter(email=email).exists():
            print("User with email already exists:", email)
            return JsonResponse({
                'success': False,
                'error': 'Email already exists'
            }, status=400)

        # Get RTOM instance
        try:
            rtom = RTOM.objects.get(id=rtom_id)
            print("Found RTOM:", rtom.name)
        except RTOM.DoesNotExist:
            print("RTOM not found with ID:", rtom_id)
            return JsonResponse({
                'success': False,
                'error': 'Invalid RTOM'
            }, status=400)

        # Create new user
        try:
            user = User.objects.create_user(
                username=employee_id,
                email=email,
                password=password,
            employee_number=employee_id,
            workgroup=workgroup,
                rtom=rtom,
                first_name=first_name,
                last_name=last_name,
                status='ACTIVE'
            )
            print("User created successfully:", user.username)
        except Exception as e:
            print("Error creating user:", str(e))
            return JsonResponse({
                'success': False,
                'error': f'Error creating user: {str(e)}'
            }, status=400)

        # Log the activity
        try:
            UserActivity.objects.create(
                user=request.user,
                activity_type='CREATE',
                description=f'Created new user {user.get_full_name()}',
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT'),
                related_object_id=user.id,
                related_object_type='User'
            )
            print("Activity logged successfully")
        except Exception as e:
            print("Error logging activity:", str(e))

        return JsonResponse({
            'success': True,
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'employee_id': user.employee_number,
                'name': user.get_full_name(),
                'email': user.email,
                'workgroup': user.workgroup,
                'rtom': user.rtom.name if user.rtom else None,
                'status': user.status
            }
        })
    except Exception as e:
        print("Unexpected error in add_user:", str(e))
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)

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

def tasks_api(request):
    if request.method == 'GET':
        tasks = Task.objects.all()  # or whatever your model is
        return JsonResponse({'tasks': list(tasks.values())})
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@login_required
@require_http_methods(["GET"])
def get_users(request):
    try:
        users = User.objects.all().exclude(id=request.user.id).select_related('rtom')
        users_data = []
        
        for user in users:
            user_data = {
                'id': user.id,
                'employee_number': user.employee_number,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'workgroup': user.workgroup,
                'workgroup_display': user.get_workgroup_display(),
                'rtom': user.rtom.name if user.rtom else None,
                'rtom_id': user.rtom.id if user.rtom else None,
                'status': user.status,
                'status_display': user.get_status_display(),
                'phone_number': user.phone_number,
                'department': user.department,
                'position': user.position,
                'date_joined': user.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
                'last_login': user.last_login.strftime('%Y-%m-%d %H:%M:%S') if user.last_login else None,
                'last_activity': user.last_activity.strftime('%Y-%m-%d %H:%M:%S') if user.last_activity else None,
                'profile_picture': user.profile_picture.url if user.profile_picture else None,
                'notes': user.notes
            }
            users_data.append(user_data)
        
        return JsonResponse({'users': users_data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
@require_http_methods(["PUT"])
def update_user(request, user_id):
    try:
        # Get the user to update
        user = get_object_or_404(User, id=user_id)
        
        # Only allow XXX-RTOM users to update other users
        if user.id != request.user.id and request.user.workgroup != 'XXX-RTOM':
            return JsonResponse({
                'error': 'Permission denied'
            }, status=403)
        
        # Parse the request data
        data = json.loads(request.body)
        print("Update user data received:", data)
        
        # Update basic user fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            # Check if email is already taken by another user
            if User.objects.exclude(id=user_id).filter(email=data['email']).exists():
                return JsonResponse({
                    'error': 'Email already exists'
                }, status=400)
            user.email = data['email']
        if 'workgroup' in data:
            user.workgroup = data['workgroup']
        if 'rtom_id' in data:
            try:
                rtom = RTOM.objects.get(id=data['rtom_id'])
                user.rtom = rtom
            except RTOM.DoesNotExist:
                return JsonResponse({
                    'error': 'Invalid RTOM ID'
                }, status=400)
        if 'status' in data:
            user.status = data['status']
        if 'phone_number' in data:
            user.phone_number = data['phone_number']
        if 'department' in data:
            user.department = data['department']
        if 'position' in data:
            user.position = data['position']
        if 'notes' in data:
            user.notes = data['notes']
        
        # Save the changes
        user.save()
        
        # Log the activity
        UserActivity.objects.create(
            user=request.user,
            activity_type='UPDATE',
            description=f'Updated user {user.get_full_name()}',
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT'),
            related_object_id=user.id,
            related_object_type='User'
        )
        
        # Return updated user data
        return JsonResponse({
            'success': True,
            'message': 'User updated successfully',
            'user': {
                'id': user.id,
                'employee_number': user.employee_number,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'workgroup': user.workgroup,
                'workgroup_display': user.get_workgroup_display(),
                'rtom_id': user.rtom.id if user.rtom else None,
                'rtom': user.rtom.name if user.rtom else None,
                'status': user.status,
                'status_display': user.get_status_display()
            }
        })
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        print("Error updating user:", str(e))
        return JsonResponse({
            'error': str(e)
        }, status=400)

@login_required
@require_http_methods(["GET"])
def get_user_activities(request, user_id=None):
    try:
        if user_id:
            activities = UserActivity.objects.filter(user_id=user_id)
        else:
            activities = UserActivity.objects.all()
        
        activities = activities.select_related('user').order_by('-created_at')[:100]  # Limit to last 100 activities
        
        activities_data = [{
            'id': activity.id,
            'user': activity.user.get_full_name(),
            'user_id': activity.user.id,
            'activity_type': activity.activity_type,
            'description': activity.description,
            'created_at': activity.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'ip_address': activity.ip_address,
            'related_object_id': activity.related_object_id,
            'related_object_type': activity.related_object_type
        } for activity in activities]
        
        return JsonResponse({'activities': activities_data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
@require_http_methods(["POST"])
def update_user_status(request, user_id):
    try:
        user = get_object_or_404(User, id=user_id)
        data = json.loads(request.body)
        new_status = data.get('status')
        
        if new_status not in dict(User.STATUS_CHOICES):
            raise ValidationError('Invalid status')
        
        user.status = new_status
        user.save()
        
        # Log the activity
        UserActivity.objects.create(
            user=request.user,
            activity_type='UPDATE',
            description=f'Updated status of user {user.get_full_name()} to {new_status}',
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT'),
            related_object_id=user.id,
            related_object_type='User'
        )
        
        return JsonResponse({
            'status': 'success',
            'message': 'User status updated successfully'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)

@login_required
@require_http_methods(["DELETE"])
def delete_user(request, user_id):
    try:
        user = get_object_or_404(User, id=user_id)
        
        # Don't allow deleting yourself
        if user.id == request.user.id:
            return JsonResponse({
                'success': False,
                'error': 'Cannot delete your own account'
            }, status=400)

        # Log the activity before deleting
        UserActivity.objects.create(
            user=request.user,
            activity_type='DELETE',
            description=f'Deleted user {user.get_full_name()}',
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT'),
            related_object_id=user.id,
            related_object_type='User'
        )

        user.delete()
        return JsonResponse({
            'success': True,
            'message': 'User deleted successfully'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)

@login_required
@require_http_methods(["GET"])
def get_rtoms(request):
    try:
        rtoms = RTOM.objects.all().order_by('name')
        rtoms_data = [{
            'id': rtom.id,
            'name': rtom.name,
            'code': rtom.code,
            'area_type': rtom.area_type
        } for rtom in rtoms]
        
        return JsonResponse({'rtoms': rtoms_data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
def dashboard(request):
    user = request.user
    workgroup = user.workgroup
    
    # Get tasks based on workgroup
    assigned_tasks = TaskAssignment.objects.filter(
        assigned_to=user,
        status='PENDING'
    ).select_related('task', 'project')
    
    context = {
        'workgroup': workgroup,
        'assigned_tasks': assigned_tasks
    }
    
    # Redirect to specific dashboard based on workgroup
    template_name = f'dashboard/{workgroup.lower()}_dashboard.html'
    return render(request, template_name, context)

@login_required
@require_http_methods(["GET"])
def get_user_details(request, user_id):
    try:
        user = get_object_or_404(User, id=user_id)
        
        # Don't allow accessing other users' details unless admin
        if user.id != request.user.id and request.user.workgroup != 'XXX-RTOM':
            return JsonResponse({
                'error': 'Permission denied'
            }, status=403)
        
        user_data = {
            'id': user.id,
            'employee_number': user.employee_number,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'workgroup': user.workgroup,
            'workgroup_display': user.get_workgroup_display(),
            'rtom_id': user.rtom.id if user.rtom else None,
            'rtom': user.rtom.name if user.rtom else None,
            'status': user.status,
            'status_display': user.get_status_display(),
            'phone_number': user.phone_number,
            'department': user.department,
            'position': user.position,
            'date_joined': user.date_joined.strftime('%Y-%m-%d %H:%M:%S'),
            'last_login': user.last_login.strftime('%Y-%m-%d %H:%M:%S') if user.last_login else None,
            'last_activity': user.last_activity.strftime('%Y-%m-%d %H:%M:%S') if user.last_activity else None,
            'profile_picture': user.profile_picture.url if user.profile_picture else None,
            'notes': user.notes
        }
        
        return JsonResponse({
            'user': user_data
        })
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=400)
