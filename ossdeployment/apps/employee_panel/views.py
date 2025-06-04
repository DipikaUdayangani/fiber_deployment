# apps/employee_panel/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import json
import os
from datetime import datetime

def login_view(request):
    return render(request, 'employee_panel/login.html')


@login_required
def dashboard_view(request):
    context = {
        'STATIC_URL': settings.STATIC_URL
    }
    return render(request, 'employee_panel/dashboard.html', context)

@login_required
def projects_view(request):
    return render(request, 'employee_panel/projects.html')

@login_required
def tasks_view(request):
    return render(request, 'employee_panel/tasks.html')

@login_required
def profile_view(request):
    # In a real application, fetch logged-in user's profile data
    context = {
        'user': request.user,  # Example of passing user object
        'STATIC_URL': settings.STATIC_URL  # Add STATIC_URL to context
    }
    return render(request, 'employee_panel/profile.html', context)

@login_required
@require_http_methods(["GET"])
def get_tasks(request):
    """
    API endpoint to get tasks for the logged-in employee.
    Currently returns dummy data, but should be replaced with actual database queries.
    """
    # TODO: Replace with actual database queries
    dummy_tasks = [
        {
            "id": 1,
            "taskName": "SPECIFY DESIGN DETAILS",
            "projectName": "Fiber Rollout Phase 1",
            "projectNo": "PROJ001",
            "workgroup": "NET-PLAN-TX",
            "rtom": "RTOM 1",
            "status": "pending",
            "documents": [
                {
                    "id": 101,
                    "name": "design_specifications_v1.pdf",
                    "uploadedBy": request.user.get_full_name() or request.user.username,
                    "uploadDate": "2024-03-15",
                    "status": "pending",
                    "type": "pdf"
                }
            ]
        },
        # Add more dummy tasks as needed
    ]
    
    return JsonResponse({
        "success": True,
        "tasks": dummy_tasks
    })

@login_required
@require_http_methods(["POST"])
def upload_task_document(request, task_id):
    """
    API endpoint to handle document uploads for tasks.
    """
    try:
        if 'document' not in request.FILES:
            return JsonResponse({
                "success": False,
                "error": "No file provided"
            }, status=400)

        file = request.FILES['document']
        description = request.POST.get('description', '')

        # Validate file size (5MB limit)
        if file.size > 5 * 1024 * 1024:  # 5MB in bytes
            return JsonResponse({
                "success": False,
                "error": "File size exceeds 5MB limit"
            }, status=400)

        # Validate file type
        allowed_types = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png']
        file_ext = os.path.splitext(file.name)[1].lower()
        if file_ext not in allowed_types:
            return JsonResponse({
                "success": False,
                "error": f"File type not allowed. Allowed types: {', '.join(allowed_types)}"
            }, status=400)

        # Generate a unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"task_{task_id}_{timestamp}{file_ext}"
        
        # Save the file
        path = default_storage.save(f'task_documents/{filename}', ContentFile(file.read()))
        
        # TODO: Save document metadata to database
        # For now, just return success
        return JsonResponse({
            "success": True,
            "message": "Document uploaded successfully",
            "document": {
                "id": 999,  # This should be the actual document ID from the database
                "name": filename,
                "uploadedBy": request.user.get_full_name() or request.user.username,
                "uploadDate": datetime.now().strftime('%Y-%m-%d'),
                "status": "pending",
                "type": file_ext[1:],  # Remove the dot from extension
                "description": description
            }
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)
