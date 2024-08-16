import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import api from './api';
import AuthContext from './AuthContext';

const Avaliador = () => {
  const { profissional } = useContext(AuthContext);
  const [servicos, setServicos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [servicosDetalhes, setServicosDetalhes] = useState({});
  const [modalData, setModalData] = useState(null);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [loadingServicos, setLoadingServicos] = useState(true);
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

        // precisar criar ume end point onde traga todos pelo e busque id pessoa para dados 
        const userDetailsPromises = response.data.map(servico =>
          api.get(`/usuarios/${servico.usuario}/`, {
            headers: {
              Authorization: `Bearer ${profissional.token}`
            }
          }).catch(error => {
            console.error(`Erro ao buscar detalhes do usuário ${servico.usuario}:`, error);
            return { data: null };
          })
        );

        const userDetailsResponses = await Promise.all(userDetailsPromises);

        const userDetails = userDetailsResponses.reduce((acc, current, index) => {
          if (current.data && current.data.nome_completo) {
            acc[response.data[index].usuario] = current.data; // Use o ID do usuário como chave
          }
          return acc;
        }, {});

        setUsuarios(userDetails);
        setLoadingUsuarios(false);

        // Fetch service details for each service
        const servicoDetailsPromises = response.data.map(servico =>
          api.get(`/servicos/${servico.servico}/`, {
            headers: {
              Authorization: `Bearer ${profissional.token}`
            }
          }).catch(error => {
            console.error(`Erro ao buscar detalhes do serviço ${servico.servico}:`, error);
            return { data: null };
          })
        );

        const servicoDetailsResponses = await Promise.all(servicoDetailsPromises);

        const servicoDetails = servicoDetailsResponses.reduce((acc, current, index) => {
          if (current.data && current.data.nome) {
            acc[response.data[index].servico] = current.data; // Use o ID do serviço como chave
          }
          return acc;
        }, {});

        setServicosDetalhes(servicoDetails);
        setLoadingServicos(false);

      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    };

    fetchAvaliacoesPendentes();
  }, [profissional, history]);

  const handleAvaliarClick = (servico) => {
    setModalData(servico);
    // Show the modal
    window.$('#avaliacaoModal').modal('show');
  };

  const handleAvaliarSubmit = async () => {
    try {
      await api.post(`/avaliacoes/${modalData.id}/`, { avaliacao: modalData.avaliacaoTexto }, {
        headers: {
          Authorization: `Bearer ${profissional.token}`
        }
      });

      alert('Avaliação enviada com sucesso!');
      setServicos(prevServicos => prevServicos.filter(servico => servico.id !== modalData.id));
      setModalData(null);
      // Hide the modal
      window.$('#avaliacaoModal').modal('hide');
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
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
                      <td>{servicosDetalhes[servico.servico]?.nome || 'Carregando...'}</td>
                      <td>
                        {usuarios[servico.usuario]?.nome_completo || 'Carregando...'}
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
            </div>
          </div>
        </div>
      </section>

      {modalData && (
        <div className="modal fade" id="avaliacaoModal" tabIndex="-1" role="dialog" aria-labelledby="avaliacaoModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="avaliacaoModalLabel">Detalhes da Avaliação</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Serviço:</strong> {servicosDetalhes[modalData.servico]?.nome}</p>
                <p><strong>Descrição:</strong> {modalData.servico.descricao}</p>
                <div className="mt-3">
                  <p><strong>Formação Técnica:</strong> {modalData.formacao_tecnica || 'Não informado'}</p>
                  <p><strong>Graduação:</strong> {modalData.graduacao || 'Não informado'}</p>
                  <p><strong>Pós-graduação:</strong> {modalData.posgraduacao || 'Não informado'}</p>
                  <p><strong>Formação Complementar:</strong> {modalData.formacao_complementar || 'Não informado'}</p>
                  <p><strong>Cargo Desejado:</strong> {modalData.cargo_desejado || 'Não informado'}</p>
                  <p><strong>Núcleo de Trabalho:</strong> {modalData.nucleo_de_trabalho || 'Não informado'}</p>
                  <p><strong>Data de Admissão:</strong> {modalData.data_admissao}</p>
                  <p><strong>Data da Avaliação:</strong> {modalData.data_avaliacao}</p>
                  <p><strong>Avaliador:</strong> {modalData.profissional || 'Não informado'}</p>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="avaliacaoTexto">Sua Avaliação:</label>
                  <textarea
                    id="avaliacaoTexto"
                    className="form-control"
                    rows="3"
                    value={modalData.avaliacaoTexto || ''}
                    onChange={(e) => setModalData({ ...modalData, avaliacaoTexto: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" className="btn btn-primary" onClick={handleAvaliarSubmit}>Enviar Avaliação</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avaliador;
