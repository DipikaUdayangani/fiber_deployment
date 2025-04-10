from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Workgroup


class LoginForm(forms.Form):
    employee_id = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))

class RegistrationForm(UserCreationForm):
    employee_id = forms.CharField(max_length=50)
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={'class': 'form-control'}))
    full_name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}))
    workgroup = forms.ModelChoiceField(queryset=Workgroup.objects.all())

    class Meta:
        model = User
        fields = ('username', 'full_name','workgroup', 'email', 'password1', 'password2')
        
    def _init_(self, *args, **kwargs):
        super(RegistrationForm, self)._init_(*args, **kwargs)
        self.fields['username'].widget.attrs['class'] ='form-control'
        self.fields['password1'].widget.attrs['class'] ='form-control'
        self.fields['password2'].widget.attrs['class'] ='form-control'