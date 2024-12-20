from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model,authenticate, login as auth_login
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, viewsets, generics
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
import json
import os
from .serializers import ServicoSerializer, PedidoSerializer, DetalhePedidoSerializer, PagamentoSerializer, ItemCarrinhoSerializer, CustomUserSerializer, AvaliacaoSerializer,ResultadoSerializer,TarefaSerializer,BlocoSerializer
from .models import Servico, Pedido, DetalhePedido, Pagamento, ItemCarrinho, Avaliacao,Transacao,Profissional,CustomUser,Resultado,Bloco,Tarefa

from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.forms import PasswordResetForm
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.core.mail import send_mail
from django.conf import settings

from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.views import PasswordResetConfirmView
from django.urls import reverse_lazy
from openai import OpenAI

client = OpenAI()

User = get_user_model()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')


@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            user = User.objects.create_user(
                email=data['email'],
                password=data['password'],
                nome_completo=data['nome_completo'],
                cep=data['cep'],
                telefone=data['telefone'],
                endereco=data['endereco'],
                cpf=data['cpf']
            )
            user = authenticate(request, email=data['email'], password=data['password'])
            if user is not None:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'status': 'success',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                })
            else:
                return JsonResponse({'status': 'error', 'errors': 'Authentication failed'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'errors': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'errors': 'Invalid request method'}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            user = authenticate(request, email=email, password=password)

            if user is not None:
                auth_login(request, user)
                refresh = RefreshToken.for_user(user)

                # Verificar se o usuário é um avaliador
                is_avaliador = Profissional.objects.filter(email=email).exists()

                return JsonResponse({
                    'status': 'success',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'is_avaliador': is_avaliador,
                    'user_id': user.id,  # Adiciona o ID do usuário
                    'nome': user.nome_completo  # Adiciona o nome do usuário (substitua 'nome_completo' pelo campo correspondente)
                })
            else:
                return JsonResponse({'status': 'error', 'errors': 'Invalid login'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'errors': 'Invalid JSON'}, status=400)
    return JsonResponse({'status': 'error', 'errors': 'Method not allowed'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_usuario(request, id):
    user = get_object_or_404(CustomUser, id=id)
    serializer = CustomUserSerializer(user)
    return Response(serializer.data)

@csrf_exempt
def profissional_login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            senha = data.get('senha')

            # Autenticar o profissional
            profissional = Profissional.objects.filter(email=email).first()

            if profissional and profissional.senha == senha:
                if profissional.is_active:
                    # Gerar o token JWT
                    refresh = RefreshToken.for_user(profissional)

                    return JsonResponse({
                        'status': 'success',
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'user_id': profissional.id,
                        'message': 'Login bem-sucedido'
                    })
                else:
                    return JsonResponse({'status': 'error', 'errors': 'Conta desativada'}, status=403)
            else:
                return JsonResponse({'status': 'error', 'errors': 'Credenciais inválidas'}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'errors': 'JSON inválido'}, status=400)
    return JsonResponse({'status': 'error', 'errors': 'Método não permitido'}, status=405)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    try:
        user = request.user
        pagamentos = Pagamento.objects.filter(usuario=user)

        user_serializer = CustomUserSerializer(user)
        pagamentos_serializer = PagamentoSerializer(pagamentos, many=True)

        data = {
            'user': user_serializer.data,
            'pagamentos': pagamentos_serializer.data
        }

        return Response(data)
    except Exception as e:
        return Response({'status': 'error', 'error': str(e)}, status=400)

class ServicoListView(generics.ListAPIView):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer
    permission_classes = []  # Permite acesso não autenticado

class ServicoDetailView(generics.RetrieveAPIView):
    queryset = Servico.objects.all()
    serializer_class = ServicoSerializer
    permission_classes = []  # Permite acesso não autenticado

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class DetalhePedidoViewSet(viewsets.ModelViewSet):
    queryset = DetalhePedido.objects.all()
    serializer_class = DetalhePedidoSerializer
    permission_classes = [IsAuthenticated]

class PagamentoViewSet(viewsets.ModelViewSet):
    queryset = Pagamento.objects.all()
    serializer_class = PagamentoSerializer

@api_view(['POST'])
def finalizar_checkout(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'status': 'error', 'error': 'Usuário não autenticado'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        with transaction.atomic():
            valor_total = Decimal(request.data.get('valor_total'))
            desconto = Decimal(request.data.get('desconto', 0.0))
            servicos = request.data.get('servicos', [])

            valor_liquido = valor_total - desconto
            print(f'Valor Total: {valor_total}, Desconto: {desconto}, Valor Líquido: {valor_liquido}')  # Adicione este log

            transacao = Transacao.objects.create(usuario=user, valor_total=valor_total, desconto=desconto, valor_liquido=valor_liquido)

            for item in servicos:
                servico_id = item.get('servico')
                quantidade = item.get('quantidade')
                valor_total_item = Decimal(item.get('valor_total'))

                servico = Servico.objects.get(id=servico_id)

                DetalhePedido.objects.create(
                    transacao=transacao,
                    servico=servico,
                    quantidade=quantidade,
                    valor_total=valor_total_item
                )

                valor_liquido_item = valor_total_item - desconto
                print(f'Criando pagamento: Valor Original: {valor_total_item}, Valor Líquido: {valor_liquido_item}')  # Adicione este log

                Pagamento.objects.create(
                    servico=servico,
                    usuario=user,
                    transacao=transacao,
                    valor_original=valor_total_item,
                    valor_liquido=valor_liquido_item,
                    desconto=desconto,
                    status='pendente'
                )

            ItemCarrinho.objects.filter(usuario=user).delete()

            return Response({'status': 'success', 'message': 'Checkout finalizado com sucesso'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'status': 'error', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST) 
@api_view(['POST'])
def webhook_pagamento(request):
    transacao_id = request.data.get('transacao_id')
    try:
        with transaction.atomic():
            transacao = Transacao.objects.get(id=transacao_id)
            pagamentos = Pagamento.objects.filter(transacao=transacao)

            for pagamento in pagamentos:
                pagamento.status = 'concluido'
                pagamento.save()

            return Response({'status': 'success', 'message': 'Pagamento confirmado com sucesso'}, status=status.HTTP_200_OK)
    except Transacao.DoesNotExist:
        return Response({'status': 'error', 'error': 'Transação não encontrada'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'status': 'error', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pagamentos_concluidos(request):
    try:
        # Filtra os pagamentos concluídos do usuário autenticado
        pagamentos = Pagamento.objects.filter(usuario=request.user, status='concluido')
        if not pagamentos:
            return Response({'status': 'success', 'message': 'Nenhum pagamento concluído encontrado'}, status=status.HTTP_204_NO_CONTENT)

        # Serializa os dados dos pagamentos
        serializer = PagamentoSerializer(pagamentos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        # Adiciona mais detalhes ao erro retornado
        return Response({'status': 'error', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ItemCarrinhoViewSet(viewsets.ModelViewSet):
    queryset = ItemCarrinho.objects.all()
    serializer_class = ItemCarrinhoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ItemCarrinho.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class AvaliacaoViewSet(viewsets.ModelViewSet):
    serializer_class = AvaliacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        servicos_pagos = Pagamento.objects.filter(usuario=self.request.user).values_list('servico_id', flat=True)
        return Avaliacao.objects.filter(servico_id__in=servicos_pagos, usuario=self.request.user)
    def perform_create(self, serializer):
        servico = serializer.validated_data['servico']
        pagamento = serializer.validated_data['pagamento']
        if Pagamento.objects.filter(usuario=self.request.user, servico=servico, id=pagamento.id).exists():
            serializer.save(usuario=self.request.user)
        else:
            raise serializers.ValidationError('Você não comprou este serviço ou o pagamento está pendente.')

    def update(self, request, *args, **kwargs):
        try:
            avaliacao = self.get_object()
            serializer = self.get_serializer(avaliacao, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        servico = serializer.validated_data['servico']
        pagamento = serializer.validated_data['pagamento']
        if Pagamento.objects.filter(usuario=self.request.user, servico=servico, id=pagamento.id).exists():
            serializer.save()
        else:
            raise serializers.ValidationError('Você não comprou este serviço ou o pagamento está pendente.')



###avaliador
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verificar_profissional(request):
    user = request.user
    is_profissional = Profissional.objects.filter(user=user).exists()
    return Response({'is_profissional': is_profissional})

##### em desenvolvimento #######
class AvaliacoesPendentesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filtra avaliações pendentes
        avaliacoes_pendentes = Avaliacao.objects.filter(avaliado=False)  # Ajuste o campo conforme necessário

        if not avaliacoes_pendentes.exists():
            return Response({'message': 'Nenhuma avaliação pendente encontrada'}, status=status.HTTP_404_NOT_FOUND)

        # Serializa os dados das avaliações pendentes com detalhes do serviço
        serializer = AvaliacaoSerializer(avaliacoes_pendentes, many=True)
        return Response(serializer.data)
class AvaliacaoViewSet(viewsets.ModelViewSet):
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        pagamento_id = self.request.query_params.get('pagamento_id', None)
        if pagamento_id is not None:
            queryset = queryset.filter(pagamento_id=pagamento_id)
        return queryset

class ResultadoViewSet(viewsets.ModelViewSet):
    queryset = Resultado.objects.all()
    serializer_class = ResultadoSerializer
    def get_queryset(self):
        queryset = super().get_queryset()
        avaliacao_id = self.request.query_params.get('avaliacao_id', None)
        if avaliacao_id is not None:
            queryset = queryset.filter(avaliacao_id=avaliacao_id)
        return queryset
class BlocoViewSet(viewsets.ModelViewSet):
    queryset = Bloco.objects.all()
    serializer_class = BlocoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        resultado_id = self.request.query_params.get('resultado_id', None)
        if resultado_id is not None:
            queryset = queryset.filter(resultado_id=resultado_id)
        return queryset
class TarefaViewSet(viewsets.ModelViewSet):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        bloco_id = self.request.query_params.get('bloco_id', None)
        if bloco_id is not None:
            queryset = queryset.filter(bloco_id=bloco_id)
        return queryset

class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, email=email)
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        reset_link = f"http://localhost:3000/reset-password/{uidb64}/{token}/"
        send_mail(
            'Password Reset Request',
            f'Use the link to reset your password: {reset_link}',
            'noreply@seu-dominio.com',
            [email],
            fail_silently=False,
        )

        return Response({'message': 'Password reset link has been sent to your email.'}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        uidb64 = request.data.get('uidb64')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not (uidb64 and token and new_password):
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid token or user'}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

 # Defina a chave API no arquivo settings.py

@api_view(['POST'])
def analyze_avaliacao(request):
    try:
        # Dados do formulário de avaliação
        form_data = request.data

        # Formate o prompt para enviar à API do ChatGPT
        prompt = f"""
        Avaliação para análise:
        Formação Técnica: {form_data.get('formacao_tecnica')}
        Graduação: {form_data.get('graduacao')}
        Pós-graduação: {form_data.get('posgraduacao')}
        Formação Complementar: {form_data.get('formacao_complementar')}
        Cargo Desejado: {form_data.get('cargo_desejado')}
        Núcleo de Trabalho: {form_data.get('nucleo_de_trabalho')}
        Data de Admissão: {form_data.get('data_admissao')}
        
        Análise detalhada e sugestões de melhoria:
        """

        # Chame o ChatGPT com o prompt atualizado
        response = client.chat.completions.create(model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
        temperature=0.7)

        # Retorne a análise do ChatGPT
        analysis = response.choices[0].message.content.strip()
        return Response({"analysis": analysis}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_resultado(request, avaliacao_id):
    try:
        resultado = Resultado.objects.get(avaliacao_id=avaliacao_id, user=request.user)
        serializer = ResultadoSerializer(resultado)
        return Response(serializer.data)
    except Resultado.DoesNotExist:
        return Response({"detail": "Não autorizado a visualizar este resultado."}, status=403)