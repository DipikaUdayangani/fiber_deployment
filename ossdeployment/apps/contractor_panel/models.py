from django.db import models
from django.conf import settings
from django.utils import timezone

# Create your models here.

class DocumentNotification(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('notified', 'Notification Sent'),
        ('reviewed', 'Reviewed'),
    ]

    document = models.ForeignKey('TaskDocument', on_delete=models.CASCADE, related_name='notifications')
    slt_employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='document_notifications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notification_sent_at = models.DateTimeField(null=True, blank=True)
    review_completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Document Review: {self.document.name} - {self.slt_employee.get_full_name()}"

class TaskDocument(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    task = models.ForeignKey('admin_panel.Task', on_delete=models.CASCADE, related_name='documents')
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='task_documents/%Y/%m/')
    upload_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_documents')
    review_date = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-upload_date']

    def __str__(self):
        return f"{self.name} - {self.task.id}"

    def notify_slt_employees(self):
        """Send notifications to SLT employees for document review"""
        from .utils import send_document_review_notification
        
        # Get all SLT employees (users with is_staff=True)
        slt_employees = settings.AUTH_USER_MODEL.objects.filter(is_staff=True)
        
        for employee in slt_employees:
            # Create notification record
            notification = DocumentNotification.objects.create(
                document=self,
                slt_employee=employee,
                status='pending'
            )
            
            # Send email notification
            send_document_review_notification(notification)
            
            # Update notification status
            notification.status = 'notified'
            notification.notification_sent_at = timezone.now()
            notification.save()

    def update_review_status(self, status, reviewed_by, rejection_reason=None):
        """Update document review status and notify relevant parties"""
        from .utils import send_document_review_update_notification
        
        self.status = status
        self.reviewed_by = reviewed_by
        self.review_date = timezone.now()
        self.rejection_reason = rejection_reason
        self.save()

        # Update all notifications for this document
        DocumentNotification.objects.filter(document=self).update(
            status='reviewed',
            review_completed_at=timezone.now()
        )

        # Send notification to document uploader
        # Assuming task has an assigned_to field referencing the user
        # You might need to adjust this based on your Task model structure
        send_document_review_update_notification(self)
