from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class LoginForm(forms.Form):
    employee_id = forms.CharField(max_length=50)
    password = forms.CharField(widget=forms.PasswordInput)

class RegistrationForm(UserCreationForm):
    employee_id = forms.CharField(max_length=50)
    email = forms.EmailField()
    
    class Meta:
        model = User
        fields = ['username', 'employee_id', 'email', 'password1', 'password2']