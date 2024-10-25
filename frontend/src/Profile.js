import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import { getUserProfile } from './api';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true); // Inicia o carregamento
      try {
        const data = await getUserProfile();
        setUserData(data.user);
        setPagamentos(data.pagamentos);
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
      } finally {
        setLoading(false); // Encerra o carregamento após a requisição
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <Loader />; // Exibe o loader enquanto os dados são carregados
  }

  if (!userData) {
    return <div>Erro ao carregar os dados do usuário.</div>;
  }

  return (
    <div className="profile col-md-12">
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <br />
      <div className="row">
        {/* Card de Perfil */}
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body-pro">
              <img src="https://via.placeholder.com/150" alt="User" className="rounded-circle mb-3" />
              <h4 className="card-title">{userData.nome_completo}</h4>
              <p className="card-text">{userData.endereco}</p>
            </div>
          </div>
        </div>

        {/* Informações Pessoais */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="h5 mb-0">Informações Pessoais</h2>
            </div>
            <div className="card-body-pro">
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Nome Completo:</strong> {userData.nome_completo}</p>
              <p><strong>CEP:</strong> {userData.cep}</p>
              <p><strong>Telefone:</strong> {userData.telefone}</p>
              <p><strong>Endereço:</strong> {userData.endereco}</p>
              <p><strong>CPF:</strong> {userData.cpf}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pagamentos */}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h2 className="h5 mb-0">Pagamentos</h2>
            </div>
            <div className="card-body-pro">
              <div className="row">
                {pagamentos.map(pagamento => (
                  <div key={pagamento.id} className="col-md-6">
                    <div className="card mb-3">
                      <div className="card-body-pro">
                        <p><strong>Serviço:</strong> {pagamento.servico.nome}</p>
                        <p><strong>Data do Pagamento:</strong> {pagamento.data_pagamento}</p>
                        <p><strong>Valor Original:</strong> R${pagamento.valor_original}</p>
                        <p><strong>Valor Líquido:</strong> R${pagamento.valor_liquido}</p>
                        <p><strong>Desconto:</strong> R${pagamento.desconto}</p>
                        <p><strong>Status:</strong> {pagamento.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
