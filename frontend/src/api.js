import axios from 'axios';

// Instância do axios para serviços públicos
const publicApi = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// Instância do axios para autenticação e requisições privadas
const privateApi = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// Função para verificar se o token está expirado
const isTokenExpired = () => {
  const token = localStorage.getItem('token');
  if (!token) return true;

  // Decodifica o token para extrair a data de expiração
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiry = payload.exp * 1000; // em milissegundos
  return Date.now() > expiry;
};

// Adiciona o token CSRF e JWT em todas as requisições privadas
privateApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('Token no interceptor:', token); // Verifique o token no interceptor

  if (token) {
    if (isTokenExpired()) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redireciona para a página de login
    } else {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
}, error => {
  return Promise.reject(error);
});

// Intercepta respostas para lidar com erros 401 (Unauthorized)
privateApi.interceptors.response.use(response => response, error => {
  if (error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redireciona para a página de login
  }
  return Promise.reject(error);
});

// Função para atualizar item no carrinho
export const updateCartItem = async (cartItemId, { quantidade, servico_id }) => {
  try {
    const response = await privateApi.put(`/carrinho/${cartItemId}/`, {
      quantidade,
      servico_id
    });
    console.log('Item atualizado no carrinho:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar item do carrinho:', error);
    throw error;
  }
};

// Função para deletar item do carrinho
export const deleteCartItem = async (cartItemId, servico_id) => {
  try {
    const response = await privateApi.delete(`/carrinho/${cartItemId}/`, {
      data: { servico_id }
    });
    console.log('Item removido do carrinho:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    throw error;
  }
};
// Função para buscar serviços (público)
export const fetchServices = async () => {
  try {
    const response = await publicApi.get('/servicos/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    throw error;
  }
};

export const getServicoById = async (id) => {
  try {
    const response = await publicApi.get(`/servicos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    throw error;
  }
};

// Função para adicionar item ao carrinho
export const addToCart = async (servicoId, quantidade) => {
  try {
    const response = await privateApi.post('/carrinho/', {
      servico_id: servicoId,
      quantidade: quantidade
    });
    console.log('Item adicionado ao carrinho:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error.response?.data || error.message);
    throw error;
  }
};

// Função para buscar itens do carrinho
export const getCartItems = async () => {
  try {
    const response = await privateApi.get('/carrinho/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar itens do carrinho:', error);
    throw error;
  }
};

// Função para finalizar a compra
export const checkout = async (cartItems) => {
  try {
    // Calcula o valor total e aplica o desconto (se houver)
    const valorTotal = cartItems.reduce((total, item) => total + (item.servico.valor * item.quantidade), 0);
    const desconto = 0; // Ajuste conforme necessário

    // Prepara os dados para envio
    const servicos = cartItems.map(item => ({
      servico: item.servico.id,
      quantidade: item.quantidade,
      valor_total: item.servico.valor * item.quantidade
    }));

    const checkoutData = {
      valor_total: valorTotal,
      desconto: desconto,
      servicos: servicos
    };

    console.log('Dados do checkout:', checkoutData);

    // Envia os dados ao backend
    const response = await privateApi.post('/finalizar-checkout/', checkoutData);

    console.log('Resposta do checkout:', response.data);

    return { status: 'success', data: response.data };
  } catch (error) {
    console.error('Erro ao finalizar compra:', error.response?.data || error.message);
    throw error;
  }
};

// Função para obter perfil do usuário
export const getUserProfile = async () => {
  try {
    const response = await privateApi.get('/perfil/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do perfil:', error);
    throw error;
  }
};

// Função para login

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:8000/api/login/', { email, password });
    const { access, refresh, nome ,id } = response.data; // A API deve retornar o nome do usuário
    localStorage.setItem('token', access);
    localStorage.setItem('access', access); // Armazena o token de acesso no localStorage
    localStorage.setItem('refresh', refresh); // Armazena o token de atualização, se necessário
    localStorage.setItem('nome_usuario', nome); 
    localStorage.setItem('user_id', id); 
    // Armazena o nome do usuário
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const loginProfissional = async (email, senha) => { 
  try {
    const response = await axios.post('http://localhost:8000/api/avaliador/login/', { email, senha });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função para registro
export const register = async (userData) => {
  try {
    const response = await publicApi.post('/register/', userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};

// Função para obter pagamentos concluídos
export const getPagamentosConcluidos = async () => {
  try {
    const response = await privateApi.get('/pagamentos-concluidos/');
    console.log('Resposta da API:', response.data); // Log para verificar a resposta da API
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pagamentos concluídos:', error);
    throw error;
  }
};

// Função para atualizar uma avaliação
export const updateAvaliacao = async (avaliacaoId, avaliacaoData) => {
  try {
    const response = await privateApi.put(`avaliacoes/${avaliacaoId}/`, avaliacaoData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um status que não está na faixa 2xx
      console.error('Erro ao atualizar avaliação:', error.response.data);
    } else if (error.request) {
      // A requisição foi feita, mas nenhuma resposta foi recebida
      console.error('Nenhuma resposta recebida:', error.request);
    } else {
      // Algo aconteceu ao configurar a requisição que acionou um erro
      console.error('Erro ao configurar requisição:', error.message);
    }
    throw error;
  }
};


// Função para obter avaliação
export const getAvaliacao = async (pagamentoId) => {
  console.log('pag:',pagamentoId)
  const response = await privateApi.get(`/avaliacoes/?pagamento_id=${pagamentoId}`);
  console.log(response)
  return await response.data[0];
};


// Função para criar uma avaliação
export const createAvaliacao = async (avaliacaoData) => {
  try {
    console.log('lajdlkasjdlaskjdas:', avaliacaoData)
    const response = await privateApi.post('/avaliacoes/', avaliacaoData);
    console.log('Avaliação criada:', response.data); // Log para verificar a criação da avaliação
    return response.data;
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    throw error;
  }
};
///chat GPT 

export const analyzeAvaliacao = async (avaliacaoData) => {
  try {
    const response = await privateApi.post('/analyze-avaliacao/', avaliacaoData);
    console.log('Resposta do endpoint analyze-avaliacao:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao analisar avaliação:', error);
    throw error;
  }
};

export default privateApi;
