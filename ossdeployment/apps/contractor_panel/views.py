from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from .models import TaskDocument, DocumentNotification
from django.utils import timezone

def is_slt_employee(user):
    return user.is_staff

@login_required
def dashboard_view(request):
    return render(request, 'contractor_panel/dashboard.html', {
        'active_tab': 'home'
    })

@login_required
def tasks_view(request):
    return render(request, 'contractor_panel/tasks.html', {
        'active_tab': 'tasks'
    })

@login_required
@user_passes_test(is_slt_employee)
def document_review(request, document_id):
    """View for SLT employees to review documents"""
    document = get_object_or_404(TaskDocument, id=document_id)
    notification = get_object_or_404(
        DocumentNotification,
        document=document,
        slt_employee=request.user,
        status__in=['pending', 'notified']
    )

    if request.method == 'POST':
        status = request.POST.get('status')
        rejection_reason = request.POST.get('rejection_reason') if status == 'rejected' else None

        if status in ['approved', 'rejected']:
            document.update_review_status(
                status=status,
                reviewed_by=request.user,
                rejection_reason=rejection_reason
            )
            messages.success(request, f'Document {status} successfully.')
            return redirect('admin:document_review_list')

    context = {
        'document': document,
        'task': document.task,
        'notification': notification
    }
    return render(request, 'contractor_panel/document_review.html', context)

@login_required
@user_passes_test(is_slt_employee)
def document_review_list(request):
    """List of documents pending review by the SLT employee"""
    notifications = DocumentNotification.objects.filter(
        slt_employee=request.user,
        status__in=['pending', 'notified']
    ).select_related('document', 'document__task')

    context = {
        'notifications': notifications
    }
    return render(request, 'contractor_panel/document_review_list.html', context)
