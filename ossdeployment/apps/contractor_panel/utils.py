from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

def send_document_review_notification(notification):
    """Send email notification to SLT employee for document review"""
    document = notification.document
    slt_employee = notification.slt_employee
    task = document.task

    context = {
        'document': document,
        'slt_employee': slt_employee,
        'task': task,
        'review_url': f"{settings.SITE_URL}/admin/document-review/{document.id}/"
    }

    # Render email templates
    html_message = render_to_string(
        'contractor_panel/email/document_review_request.html',
        context
    )
    plain_message = strip_tags(html_message)

    # Send email
    send_mail(
        subject=f'Document Review Required: {document.name}',
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[slt_employee.email],
        html_message=html_message,
        fail_silently=False,
    )

def send_document_review_update_notification(document):
    """Send email notification to document uploader about review status"""
    task = document.task
    uploader = task.assigned_to  # Assuming task has an assigned_to field

    context = {
        'document': document,
        'task': task,
        'reviewer': document.reviewed_by,
        'status': document.status,
        'rejection_reason': document.rejection_reason,
        'task_url': f"{settings.SITE_URL}/contractor/tasks/{task.id}/"
    }

    # Render email templates
    html_message = render_to_string(
        'contractor_panel/email/document_review_update.html',
        context
    )
    plain_message = strip_tags(html_message)

    # Send email
    send_mail(
        subject=f'Document Review Update: {document.name}',
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[uploader.email],
        html_message=html_message,
        fail_silently=False,
    ) 