import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import api from './api';
import AuthContext from './AuthContext';

const AvaliacaoResultado = () => {
  const { id } = useParams(); // Obtém o ID do serviço a ser avaliado
  const { profissional } = useContext(AuthContext);
  const [servico, setServico] = useState(null);
  const [servicoDetalhes, setServicoDetalhes] = useState(null);
  const [avaliacaoTexto, setAvaliacaoTexto] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (!profissional.token) {
      alert('Acesso negado. Esta área é restrita a profissionais.');
      history.push('/avaliador/login');
      return;
    }

    const fetchServicoDetalhes = async () => {
      try {
        const response = await api.get(`/avaliacoes-pendentes/${id}/`, {
          headers: {
            Authorization: `Bearer ${profissional.token}`,
          },
        });
        setServico(response.data);

        const servicoDetailResponse = await api.get(`/servicos/${response.data.servico}/`, {
          headers: {
            Authorization: `Bearer ${profissional.token}`,
          },
        });
        setServicoDetalhes(servicoDetailResponse.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do serviço:', error);
      }
    };

    fetchServicoDetalhes();
  }, [id, profissional.token, history]);

  const handleAvaliarSubmit = async () => {
    try {
      await api.post(`/avaliacoes/${id}/`, { avaliacao: avaliacaoTexto }, {
        headers: {
          Authorization: `Bearer ${profissional.token}`,
        },
      });

      alert('Avaliação enviada com sucesso!');
      history.push('/avaliador'); // Redireciona de volta para a lista de avaliações
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    }
  };

  if (!servico || !servicoDetalhes) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Detalhes da Avaliação</h1>
      <p><strong>Serviço:</strong> {servicoDetalhes.nome}</p>
      <p><strong>Descrição:</strong> {servicoDetalhes.descricao}</p>

      <div className="mt-3">
        <p><strong>Formação Técnica:</strong> {servico.formacao_tecnica || 'Não informado'}</p>
        <p><strong>Graduação:</strong> {servico.graduacao || 'Não informado'}</p>
        <p><strong>Pós-graduação:</strong> {servico.posgraduacao || 'Não informado'}</p>
        <p><strong>Formação Complementar:</strong> {servico.formacao_complementar || 'Não informado'}</p>
        <p><strong>Cargo Desejado:</strong> {servico.cargo_desejado || 'Não informado'}</p>
        <p><strong>Núcleo de Trabalho:</strong> {servico.nucleo_de_trabalho || 'Não informado'}</p>
        <p><strong>Data de Admissão:</strong> {servico.data_admissao}</p>
        <p><strong>Data da Avaliação:</strong> {servico.data_avaliacao}</p>
        <p><strong>Avaliador:</strong> {servico.profissional || 'Não informado'}</p>
      </div>

      <div className="form-group mt-3">
        <label htmlFor="avaliacaoTexto">Sua Avaliação:</label>
        <textarea
          id="avaliacaoTexto"
          className="form-control"
          rows="3"
          value={avaliacaoTexto}
          onChange={(e) => setAvaliacaoTexto(e.target.value)}
        ></textarea>
      </div>

      <button type="button" className="btn btn-primary mt-3" onClick={handleAvaliarSubmit}>Enviar Avaliação</button>
    </div>
  );
};

export default AvaliacaoResultado;
