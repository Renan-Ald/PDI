from django.contrib import admin
from django.urls import path, include
from servico import views
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('servico.urls')),  # Inclui URLs da API do aplicativo 'servico'
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
]
