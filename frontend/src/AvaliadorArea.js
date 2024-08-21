import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import api from './api';
import AuthContext from './AuthContext';

const Avaliador = () => {
  const { profissional } = useContext(AuthContext);
  const [servicos, setServicos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [servicosDetalhes, setServicosDetalhes] = useState({});
  const [loading, setLoading] = useState({ usuarios: true, servicos: true });
  const history = useHistory();

  useEffect(() => {
    if (!profissional.token) {
      alert('Acesso negado. Esta área é restrita a profissionais.');
      history.push('/avaliador/login');
      return;
    }

    const fetchAvaliacoesPendentes = async () => {
      try {
        const response = await api.get('avaliacoes-pendentes/', {
          headers: {
            Authorization: `Bearer ${profissional.token}`
          }
        });
        setServicos(response.data);

        await fetchUsuariosEServicosDetalhes(response.data);

      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        alert('Erro ao carregar as avaliações pendentes.');
      }
    };

    const fetchUsuariosEServicosDetalhes = async (avaliacoes) => {
      try {
        const userDetailsPromises = avaliacoes.map(servico =>
          api.get(`/usuarios/${servico.usuario}/`, {
            headers: {
              Authorization: `Bearer ${profissional.token}`
            }
          }).catch(error => {
            console.error(`Erro ao buscar detalhes do usuário ${servico.usuario}:`, error);
            return { data: null };
          })
        );

        const servicoDetailsPromises = avaliacoes.map(servico =>
          api.get(`/servicos/${servico.servico}/`, {
            headers: {
              Authorization: `Bearer ${profissional.token}`
            }
          }).catch(error => {
            console.error(`Erro ao buscar detalhes do serviço ${servico.servico}:`, error);
            return { data: null };
          })
        );

        const [userDetailsResponses, servicoDetailsResponses] = await Promise.all([
          Promise.all(userDetailsPromises),
          Promise.all(servicoDetailsPromises)
        ]);

        const userDetails = userDetailsResponses.reduce((acc, current, index) => {
          if (current.data && current.data.nome_completo) {
            acc[avaliacoes[index].usuario] = current.data;
          }
          return acc;
        }, {});

        const servicoDetails = servicoDetailsResponses.reduce((acc, current, index) => {
          if (current.data && current.data.nome) {
            acc[avaliacoes[index].servico] = current.data;
          }
          return acc;
        }, {});

        setUsuarios(userDetails);
        setServicosDetalhes(servicoDetails);
        setLoading({ usuarios: false, servicos: false });

      } catch (error) {
        console.error('Erro ao buscar detalhes dos usuários e serviços:', error);
        alert('Erro ao carregar detalhes dos usuários e serviços.');
      }
    };

    fetchAvaliacoesPendentes();
  }, [profissional, history]);

  const handleAvaliarClick = async (servico) => {
    const postData = {
      avaliacao_id: servico.id,
      validade: "2024-12-31",
      responsavel: profissional.user_id,
      data_resultado: "2024-12-31"
    };

    try {
      await api.post('resultados/', postData, {
        headers: {
          Authorization: `Bearer ${profissional.token}`
        }
      });
      alert('Avaliação enviada com sucesso!');
      history.push('/avaliacao-resultado');
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error.response?.data || error.message);
      alert('Erro ao enviar a avaliação. Tente novamente.');
    }
  };

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

      <section className="pt-7">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12 text-md-start text-center py-6">
              <h1 className="mb-4 fs-9 fw-bold">Avaliações Pendentes</h1>
              <p className="mb-6 lead text-secondary">
                Aqui estão os serviços que precisam ser avaliados. Clique no botão "Avaliar" para fornecer feedback sobre os serviços.
              </p>

              {loading.usuarios || loading.servicos ? (
                <p>Carregando dados...</p>
              ) : (
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Serviço</th>
                      <th>Nome do Usuário</th>
                      <th>Status</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicos.map(servico => (
                      <tr key={servico.id}>
                        <td>{servicosDetalhes[servico.servico]?.nome || 'Desconhecido'}</td>
                        <td>
                          {usuarios[servico.usuario]?.nome_completo || 'Desconhecido'}
                        </td>
                        <td>{servico.avaliado ? 'Feito' : 'Não Feito'}</td>
                        <td>
                          {!servico.avaliado && (
                            <button
                              className="btn btn-primary"
                              onClick={() => handleAvaliarClick(servico)}
                            >
                              Avaliar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Avaliador;
