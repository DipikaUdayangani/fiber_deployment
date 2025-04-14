from django.shortcuts import render

def contractor_dashboard(request):
    return render(request, 'contractor_panel/dashboard.html')
