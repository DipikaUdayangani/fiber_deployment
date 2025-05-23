from django.core.management.base import BaseCommand
from apps.admin_panel.models import User

class Command(BaseCommand):
    help = 'Create initial users'

    def handle(self, *args, **kwargs):
        # Create admin user
        admin_user = User.objects.create_user(
            username='ADMIN001',
            employee_number='ADMIN001',
            password='admin123',
            email='admin@slt.lk',
            workgroup='XXX-RTOM',
            is_staff=True,
            is_superuser=True
        )

        # Create employee user
        employee_user = User.objects.create_user(
            username='EMP001',
            employee_number='EMP001',
            password='emp123',
            email='employee@slt.lk',
            workgroup='NET-PROJ-ACC-CABLE'
        )

        # Create contractor user
        contractor_user = User.objects.create_user(
            username='CON001',
            employee_number='CON001',
            password='con123',
            email='contractor@slt.lk',
            workgroup='XXX-MNG-OPMC'
        )

        self.stdout.write(self.style.SUCCESS('Successfully created initial users'))