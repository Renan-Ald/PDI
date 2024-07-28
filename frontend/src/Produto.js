import React from 'react';

const Produto = ({ servico }) => {
  const adicionarAoCarrinho = async (servicoId) => {
    const response = await fetch(`/carrinho/adicionar/${servicoId}/`, {
      method: 'POST',
      credentials: 'include', // Para enviar cookies de autenticação
    });

    const data = await response.json();
    if (data.status === 'success') {
      alert('Item adicionado ao carrinho!');
    } else {
      alert('Falha ao adicionar item ao carrinho');
    }
  };

  return (
    <div>
      <h2>{servico.nome}</h2>
      <p>{servico.descricao}</p>
      <p>R${servico.valor}</p>
      <button onClick={() => adicionarAoCarrinho(servico.id)}>Adicionar ao Carrinho</button>
    </div>
  );
};

export default Produto;
