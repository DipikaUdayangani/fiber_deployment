from django.db import migrations, models
import django.db.models.deletion
import django.contrib.auth.models
import django.contrib.auth.validators
import django.utils.timezone

class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('admin_panel', '0006_alter_task_options_alter_taskassignment_options_and_more'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='user',
            table='admin_panel_user',
        ),
        migrations.AlterField(
            model_name='user',
            name='employee_number',
            field=models.CharField(max_length=50, unique=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True, db_index=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='workgroup',
            field=models.CharField(max_length=50, choices=[
                ('NET-PLAN-TX', 'NET-PLAN-TX'),
                ('LEA-MNG-OPMC', 'LEA-MNG-OPMC'),
                ('NET-PLAN-ACC', 'NET-PLAN-ACC'),
                ('NET-PROJ-ACC-CABLE', 'NET-PROJ-ACC-CABLE'),
                ('XXX-MNG-OPMC', 'XXX-MNG-OPMC'),
                ('XXX-ENG-NW', 'XXX-ENG-NW'),
                ('NET-PLAN-DRAWING', 'NET-PLAN-DRAWING'),
                ('XXX-RTOM', 'XXX-RTOM'),
            ], db_index=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='status',
            field=models.CharField(
                max_length=20,
                choices=[
                    ('ACTIVE', 'Active'),
                    ('INACTIVE', 'Inactive'),
                    ('SUSPENDED', 'Suspended'),
                ],
                default='ACTIVE',
                db_index=True
            ),
        ),
        migrations.AlterField(
            model_name='user',
            name='date_joined',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['employee_number'], name='admin_panel_employee_123456_idx'),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['email'], name='admin_panel_email_123456_idx'),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['workgroup'], name='admin_panel_workgroup_123456_idx'),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['status'], name='admin_panel_status_123456_idx'),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['date_joined'], name='admin_panel_date_joined_123456_idx'),
        ),
    ] 