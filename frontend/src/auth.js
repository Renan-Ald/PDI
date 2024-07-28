// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
    return !!localStorage.getItem('token'); // Verifica se o token está presente no armazenamento local
  };
  