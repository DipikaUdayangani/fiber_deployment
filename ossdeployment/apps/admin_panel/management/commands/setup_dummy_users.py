from django.core.management.base import BaseCommand
from apps.admin_panel.models import User, DummyCredentials

class Command(BaseCommand):
    help = 'Creates dummy users for testing'

    def handle(self, *args, **kwargs):
        # Create admin user
        User.objects.create_user(
            username=DummyCredentials.ADMIN['employee_id'],
            password=DummyCredentials.ADMIN['password'],
            email=DummyCredentials.ADMIN['email'],
            employee_number=DummyCredentials.ADMIN['employee_id'],
            workgroup=DummyCredentials.ADMIN['workgroup'],
            is_staff=True,
            is_superuser=True
        )

        # Create employee user
        User.objects.create_user(
            username=DummyCredentials.EMPLOYEE['employee_id'],
            password=DummyCredentials.EMPLOYEE['password'],
            email=DummyCredentials.EMPLOYEE['email'],
            employee_number=DummyCredentials.EMPLOYEE['employee_id'],
            workgroup=DummyCredentials.EMPLOYEE['workgroup']
        )

        # Create contractor user
        User.objects.create_user(
            username=DummyCredentials.CONTRACTOR['employee_id'],
            password=DummyCredentials.CONTRACTOR['password'],
            email=DummyCredentials.CONTRACTOR['email'],
            employee_number=DummyCredentials.CONTRACTOR['employee_id'],
            workgroup=DummyCredentials.CONTRACTOR['workgroup']
        )

        self.stdout.write(self.style.SUCCESS('Successfully created dummy users'))