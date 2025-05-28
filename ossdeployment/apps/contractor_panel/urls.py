from django.urls import path
from . import views

app_name = 'contractor_panel'

urlpatterns = [
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('tasks/', views.tasks_view, name='tasks'),
    path('documents/review/', views.document_review_list, name='document_review_list'),
    path('documents/review/<int:document_id>/', views.document_review, name='document_review'),
]

