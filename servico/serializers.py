from rest_framework import serializers, viewsets  # Importando viewsets aqui
from .models import Servico ,DetalhePedido,Pedido, Pagamento,ItemCarrinho, CustomUser,Avaliacao,Transacao

class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = '__all__'

class ServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servico
        fields = ['id', 'nome', 'descricao', 'valor']

class DetalhePedidoSerializer(serializers.ModelSerializer):
    servico = serializers.PrimaryKeyRelatedField(queryset=Servico.objects.all())
    
    class Meta:
        model = DetalhePedido
        fields = ['servico', 'quantidade', 'valor_total']

class CheckoutSerializer(serializers.Serializer):
    valor_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    desconto = serializers.DecimalField(max_digits=10, decimal_places=2)
    servicos = DetalhePedidoSerializer(many=True)

    def create(self, validated_data):
        usuario = self.context['request'].user
        servicos_data = validated_data.pop('servicos')
        transacao = Transacao.objects.create(usuario=usuario, **validated_data)
        
        for servico_data in servicos_data:
            servico = Servico.objects.get(id=servico_data['servico'].id)
            detalhe_pedido = DetalhePedido.objects.create(transacao=transacao, servico=servico, **servico_data)
            
            # Criar pagamentos associados aos detalhes do pedido
            Pagamento.objects.create(
                servico=servico,
                usuario=usuario,
                transacao=transacao,
                valor_original=servico_data['valor_total'],
                valor_liquido=servico_data['valor_total'] - validated_data['desconto'],
                desconto=validated_data['desconto'],
                status='pendente'
            )
        
        return transacao

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'nome_completo', 'cep', 'telefone', 'endereco', 'cpf']


class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'data_pedido', 'valor_total', 'desconto']
        read_only_fields = ['usuario', 'data_pedido']  # `usuario` e `data_pedido` são preenchidos automaticamente

    def create(self, validated_data):
        # O `usuario` será preenchido pelo viewset
        return super().create(validated_data)
    
######carrinho
class ItemCarrinhoSerializer(serializers.ModelSerializer):
    servico_id = serializers.PrimaryKeyRelatedField(
        queryset=Servico.objects.all(), source='servico', write_only=True
    )
    servico = serializers.SerializerMethodField()

    class Meta:
        model = ItemCarrinho
        fields = ['id', 'servico', 'servico_id', 'quantidade', 'usuario']
        read_only_fields = ['usuario']

    def get_servico(self, obj):
        return {
            'id': obj.servico.id,
            'nome': obj.servico.nome,
            'descricao': obj.servico.descricao,
            'valor': obj.servico.valor
        }

    def create(self, validated_data):
        return ItemCarrinho.objects.create(**validated_data)

##pagamento
class PagamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pagamento
        fields = ['id', 'servico', 'usuario', 'transacao', 'valor_original', 'valor_liquido', 'desconto', 'status', 'data_pagamento']


##avaliacao

class AvaliacaoSerializer(serializers.ModelSerializer):
    servico = serializers.PrimaryKeyRelatedField(queryset=Servico.objects.all())
    pagamento = serializers.PrimaryKeyRelatedField(queryset=Pagamento.objects.all())  # Ajuste para 'pagamento'

    class Meta:
        model = Avaliacao
        fields = [
            'id', 'usuario', 'servico', 'pagamento', 'formacao_tecnica', 'graduacao', 'posgraduacao',
            'formacao_complementar', 'cargo_desejado', 'nucleo_de_trabalho', 'data_admissao',
            'data_avaliacao', 'avaliado', 'profissional'
        ]
        read_only_fields = ['usuario', 'data_avaliacao', 'avaliado', 'profissional']

    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)
