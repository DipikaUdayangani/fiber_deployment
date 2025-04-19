from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import TaskAssignment

@login_required
def dashboard_view(request):
    if request.user.workgroup != 'XXX-RTOM':
        return redirect('accounts:login')
    
    context = {
        'user': request.user
    }
    return render(request, 'admin_panel/dashboard.html', context)
