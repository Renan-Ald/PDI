// src/Profile.js
import React, { useEffect, useState } from 'react';
import { getUserProfile } from './api';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [pagamentos, setPagamentos] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getUserProfile();
        setUserData(data.user);
        setPagamentos(data.pagamentos);
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
      }
    };

    fetchProfileData();
  }, []);

  if (!userData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mt-5">
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <h1 className="text-center mb-4">Perfil do Usuário</h1>
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="h5 mb-0">Informações Pessoais</h2>
        </div>
        <div className="card-body">
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Nome Completo:</strong> {userData.nome_completo}</p>
          <p><strong>CEP:</strong> {userData.cep}</p>
          <p><strong>Telefone:</strong> {userData.telefone}</p>
          <p><strong>Endereço:</strong> {userData.endereco}</p>
          <p><strong>CPF:</strong> {userData.cpf}</p>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="h5 mb-0">Pagamentos</h2>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {pagamentos.map(pagamento => (
              <li key={pagamento.id} className="list-group-item">
                <p><strong>Serviço:</strong> {pagamento.servico.nome}</p>
                <p><strong>Data do Pagamento:</strong> {pagamento.data_pagamento}</p>
                <p><strong>Valor Original:</strong> R${pagamento.valor_original}</p>
                <p><strong>Valor Líquido:</strong> R${pagamento.valor_liquido}</p>
                <p><strong>Desconto:</strong> R${pagamento.desconto}</p>
                <p><strong>Status:</strong> {pagamento.status}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
