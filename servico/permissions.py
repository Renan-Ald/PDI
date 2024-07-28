from rest_framework.permissions import BasePermission
from .models import Profissional

class IsProfissional(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            # Verifica se o usuário autenticado é um profissional
            Profissional.objects.get(usuario=request.user)
            return True
        except Profissional.DoesNotExist:
            return False
