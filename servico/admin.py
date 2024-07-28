from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Servico,Profissional 


admin.site.register(Servico)

class ServicoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'preco')

@admin.register(Profissional)
class ProfissionalAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'email', 'graduacao', 'is_active', 'status')  # Exibir status na lista
    list_filter = ('is_active',)  # Filtros para listar apenas ativos ou inativos
    search_fields = ('nome_completo', 'email', 'cpf')  # Campos pesquisáveis
    fields = ('nome_completo', 'email', 'graduacao', 'senha', 'cep', 'cpf', 'is_active')  # Campos editáveis