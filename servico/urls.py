from django.urls import path,include  
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter    
from .views import register, login_view, ServicoListView, ServicoDetailView, PedidoViewSet, DetalhePedidoViewSet,PagamentoViewSet,finalizar_checkout,webhook_pagamento,ItemCarrinhoViewSet,user_profile,AvaliacaoViewSet,pagamentos_concluidos,AvaliacoesPendentesView,get_usuario,ResultadoViewSet,TarefaViewSet,BlocoViewSet
from . import views


router = DefaultRouter()
router.register(r'pedidos', PedidoViewSet)
router.register(r'detalhes-pedidos', DetalhePedidoViewSet)
router.register(r'pagamentos', PagamentoViewSet)
router.register(r'carrinho', ItemCarrinhoViewSet)
router.register(r'avaliacoes', AvaliacaoViewSet, basename='avaliacao')
router.register(r'resultados', ResultadoViewSet)
router.register(r'blocos', BlocoViewSet)
router.register(r'tarefas', TarefaViewSet)
urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('servicos/', ServicoListView.as_view(), name='servico-list'),
    path('servicos/<int:pk>/', ServicoDetailView.as_view(), name='servico-detail'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
    path('finalizar-checkout/', finalizar_checkout, name='finalizar_checkout'),
    path('webhook_pagamento/', webhook_pagamento, name='webhook_pagamento'),
    path('perfil/', user_profile, name='user-profile'),
    path('pagamentos-concluidos/', pagamentos_concluidos, name='pagamentos-concluidos'),
    path('avaliador/login/', views.profissional_login_view, name='profissional-login'),
    path('avaliacoes-pendentes/', AvaliacoesPendentesView.as_view(), name='avaliacoes-pendentes'),
    path('usuarios/<int:id>/', get_usuario, name='get_usuario'),
]
