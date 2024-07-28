

from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import Resposta
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        fields = ['username', 'email']
class RespostaForm(forms.ModelForm):
    class Meta:
        model = Resposta
        fields = ['resposta']

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['email', 'nome_completo', 'cep', 'telefone', 'endereco', 'cpf', 'password1', 'password2']

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(label='Email')
    class Meta:
        model = CustomUser
        fields = ['username', 'password']
