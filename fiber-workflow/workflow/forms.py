from django import forms
from .models import Employee

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = ['employee_id', 'workgroup', 'rtom']

class PasswordChangeForm(forms.Form):
    current_password = forms.CharField(widget=forms.PasswordInput)
    new_password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)