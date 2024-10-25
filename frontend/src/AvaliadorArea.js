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
  const [search, setSearch] = useState({ nome: '', servico: '', status: '' });
  const [filteredServicos, setFilteredServicos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
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
        const avaliacoes = response.data;

        await fetchUsuariosEServicosDetalhes(avaliacoes);
        await verificarStatusAvaliacoes(avaliacoes);

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
        setLoading((prev) => ({ ...prev, usuarios: false, servicos: false }));

      } catch (error) {
        console.error('Erro ao buscar detalhes dos usuários e serviços:', error);
        alert('Erro ao carregar detalhes dos usuários e serviços.');
      }
    };

    const verificarStatusAvaliacoes = async (avaliacoes) => {
      try {
        const statusPromises = avaliacoes.map(async (servico) => {
          const response = await api.get(`resultados/?avaliacao_id=${servico.id}`, {
            headers: {
              Authorization: `Bearer ${profissional.token}`
            }
          });
          return response.data.length > 0;
        });

        const statusResults = await Promise.all(statusPromises);

        const updatedAvaliacoes = avaliacoes.map((servico, index) => ({
          ...servico,
          avaliado: statusResults[index]
        }));

        setServicos(updatedAvaliacoes);
      } catch (error) {
        console.error('Erro ao verificar status das avaliações:', error);
        alert('Erro ao verificar status das avaliações.');
      }
    };

    fetchAvaliacoesPendentes();
  }, [profissional, history]);

  useEffect(() => {
    const filterServicos = () => {
      const filtered = servicos.filter(servico => {
        const nomeUsuario = usuarios[servico.usuario]?.nome_completo || '';
        const nomeServico = servicosDetalhes[servico.servico]?.nome || '';
        const status = servico.avaliado ? 'Feito' : 'Não Feito';

        return (
          nomeUsuario.toLowerCase().includes(search.nome.toLowerCase()) &&
          nomeServico.toLowerCase().includes(search.servico.toLowerCase()) &&
          status.toLowerCase().includes(search.status.toLowerCase())
        );
      });
      setFilteredServicos(filtered);
    };

    filterServicos();
  }, [search, servicos, usuarios, servicosDetalhes]);

  const handleAvaliarClick = async (servico) => {
    try {
      const existingResult = await api.get(`resultados/?avaliacao_id=${servico.id}`, {
        headers: {
          Authorization: `Bearer ${profissional.token}`
        }
      });

      const resultExists = existingResult.data.some(result => result.avaliacao_id === servico.id);

      if (resultExists) {
        alert('Avaliação já existente, redirecionando...');
        history.push(`/avaliacao-resultado/${servico.id}`);
      } else {
        const postData = {
          avaliacao_id: servico.id,
          validade: "2024-12-31",
          responsavel: profissional.user_id,
          data_resultado: "2024-12-31"
        };

        await api.post('resultados/', postData, {
          headers: {
            Authorization: `Bearer ${profissional.token}`
          }
        });
        alert('Avaliação enviada com sucesso!');
        history.push(`/avaliacao-resultado/${servico.id}`);
      }
    } catch (error) {
      console.error('Erro ao verificar/enviar avaliação:', error.response?.data || error.message);
      alert('Erro ao enviar a avaliação. Tente novamente.');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredAndPaginatedServicos = filteredServicos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <section className="pt-7">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12 text-md-start text-center py-6">
              <h1 className="mb-4 fs-9 fw-bold">Avaliações Pendentes</h1>
              <p className="mb-6 lead text-secondary">
                Aqui estão os serviços que precisam ser avaliados. Utilize os filtros para buscar e clique no botão "Avaliar" para fornecer feedback sobre os serviços.
              </p>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Filtrar por nome do usuário"
                  value={search.nome}
                  onChange={(e) => setSearch({ ...search, nome: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Filtrar por nome do serviço"
                  value={search.servico}
                  onChange={(e) => setSearch({ ...search, servico: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Filtrar por status (Feito ou Não Feito)"
                  value={search.status}
                  onChange={(e) => setSearch({ ...search, status: e.target.value })}
                />
              </div>

              {loading.usuarios || loading.servicos ? (
                <p>Carregando dados...</p>
              ) : (
                <>
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
                      {filteredAndPaginatedServicos.map(servico => (
                        <tr key={servico.id}>
                          <td>{servicosDetalhes[servico.servico]?.nome || 'Desconhecido'}</td>
                          <td>{usuarios[servico.usuario]?.nome_completo || 'Desconhecido'}</td>
                          <td>{servico.avaliado ? 'Feito' : 'Não Feito'}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleAvaliarClick(servico)}
                            >
                              Avaliar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <nav aria-label="Page navigation">
                    <ul className="pagination">
                      {Array(Math.ceil(filteredServicos.length / itemsPerPage))
                        .fill(null)
                        .map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                    </ul>
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Avaliador;
