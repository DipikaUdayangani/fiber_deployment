from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from .forms import LoginForm, RegistrationForm
from django.contrib import messages

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            employee_id = form.cleaned_data.get('employee_id')
            password = form.cleaned_data.get('password')
            user = authenticate(username=employee_id, password=password)
            if user is not None:
                login(request, user)
                return redirect('dashboard')
            else:
                messages.error(request, 'Invalid employee ID or password')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

# Add @login_required to all your existing views
@login_required
def settings(request):
    return render(request, 'settings.html')