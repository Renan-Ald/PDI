from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import User

class Servico(models.Model):
    nome = models.CharField(max_length=100)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.TextField()

    def __str__(self):
        return self.nome

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O email deve ser fornecido')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nome_completo = models.CharField(max_length=255)
    cep = models.CharField(max_length=10)
    telefone = models.CharField(max_length=20)
    endereco = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome_completo', 'cep', 'telefone', 'endereco', 'cpf']

    def __str__(self):
        return self.email

####################avaliador
class Profissional(models.Model):
    nome_completo = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    graduacao = models.CharField(max_length=255)
    senha = models.CharField(max_length=255)  # Note: For security, consider using hashed passwords
    cep = models.CharField(max_length=10)
    cpf = models.CharField(max_length=14)
    is_active = models.BooleanField(default=True)  # Novo campo para ativar/desativar conta

    def __str__(self):
        return self.nome_completo

    def clean(self):
        super().clean()
        if self.senha and len(self.senha) < 6:
            raise ValidationError(_('A senha deve ter pelo menos 6 caracteres.'))

    def status(self):
        return "Ativo" if self.is_active else "Desativado"

###pedido
class Pedido(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    data_pedido = models.DateTimeField(auto_now_add=True)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)
    desconto = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)

    def __str__(self):
        return f"Pedido {self.id} - {self.usuario.email}"


class ItemCarrinho(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    servico = models.ForeignKey(Servico, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f"{self.servico.nome} - {self.quantidade} item(ns)"
            
class Transacao(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)
    desconto = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    data_transacao = models.DateTimeField(auto_now_add=True)
    valor_liquido = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f'Transacao {self.id} - Usuario {self.usuario.email}'

class DetalhePedido(models.Model):
    transacao = models.ForeignKey(Transacao, related_name='detalhes', on_delete=models.CASCADE)
    servico = models.ForeignKey(Servico, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()
    valor_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'Detalhe Pedido {self.id} - Transacao {self.transacao.id}'

class Pagamento(models.Model):
    servico = models.ForeignKey(Servico, on_delete=models.CASCADE)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    transacao = models.ForeignKey(Transacao, on_delete=models.CASCADE, related_name='pagamentos')
    valor_original = models.DecimalField(max_digits=10, decimal_places=2)
    valor_liquido = models.DecimalField(max_digits=10, decimal_places=2)
    desconto = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=20, choices=[('pendente', 'Pendente'), ('concluido', 'Concluído')], default='pendente')
    data_pagamento = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pagamento {self.id} - Servico {self.servico.nome}'
    

#########################################avaliações
class Avaliacao(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    servico = models.ForeignKey('Servico', on_delete=models.CASCADE)
    pagamento = models.ForeignKey(Pagamento, on_delete=models.CASCADE)
    formacao_tecnica = models.CharField(max_length=255)
    graduacao = models.CharField(max_length=255)
    posgraduacao = models.CharField(max_length=255)
    formacao_complementar = models.CharField(max_length=255)
    cargo_desejado = models.CharField(max_length=255)
    nucleo_de_trabalho = models.CharField(max_length=255)
    data_admissao = models.DateField()
    data_avaliacao = models.DateTimeField(auto_now_add=True)
    avaliado = models.BooleanField(default=False)
    profissional = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='avaliacoes', null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f'Avaliação de {self.usuario} para {self.servico}'