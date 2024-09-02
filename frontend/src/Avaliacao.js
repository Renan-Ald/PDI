import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getPagamentosConcluidos, getAvaliacao, createAvaliacao, updateAvaliacao } from './api';
import './Avaliacao.css';

const Avaliacao = () => {
  const history = useHistory();
  const [pagamentos, setPagamentos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState({});
  const [selectedPagamento, setSelectedPagamento] = useState(null);
  const [formacaoTecnica, setFormacaoTecnica] = useState('');
  const [graduacao, setGraduacao] = useState('');
  const [posgraduacao, setPosgraduacao] = useState('');
  const [formacaoComplementar, setFormacaoComplementar] = useState('');
  const [cargoDesejado, setCargoDesejado] = useState('');
  const [nucleoDeTrabalho, setNucleoDeTrabalho] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [avaliacao, setAvaliacao] = useState(null);

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const pagamentosData = await getPagamentosConcluidos();
        setPagamentos(pagamentosData);

        const avaliacoesData = {};
        for (let pagamento of pagamentosData) {
          const avaliacao = await getAvaliacao(pagamento.id);
          avaliacoesData[pagamento.id] = avaliacao;
        }
        setAvaliacoes(avaliacoesData);
      } catch (error) {
        console.error('Erro ao buscar pagamentos ou avaliações:', error);
      }
    };

    fetchPagamentos();
  }, []);

  const handlePagamentoSelect = async (pagamento) => {
    setSelectedPagamento(pagamento);
    setModalOpen(true);

    const avaliacaoExistente = avaliacoes[pagamento.id];
    if (avaliacaoExistente) {
      setAvaliacao(avaliacaoExistente);
      setFormacaoTecnica(avaliacaoExistente.formacao_tecnica);
      setGraduacao(avaliacaoExistente.graduacao);
      setPosgraduacao(avaliacaoExistente.posgraduacao);
      setFormacaoComplementar(avaliacaoExistente.formacao_complementar);
      setCargoDesejado(avaliacaoExistente.cargo_desejado);
      setNucleoDeTrabalho(avaliacaoExistente.nucleo_de_trabalho);
      setDataAdmissao(avaliacaoExistente.data_admissao);
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormacaoTecnica('');
    setGraduacao('');
    setPosgraduacao('');
    setFormacaoComplementar('');
    setCargoDesejado('');
    setNucleoDeTrabalho('');
    setDataAdmissao('');
    setAvaliacao(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPagamento) {
      alert('Por favor, selecione um pagamento primeiro.');
      return;
    }

    const userId = selectedPagamento.usuario;
    const servicoId = selectedPagamento.servico.id;
    const pagamentoId = selectedPagamento.id;

    try {
      if (avaliacao) {
        await updateAvaliacao(avaliacao.id, {
          formacao_tecnica: formacaoTecnica,
          graduacao: graduacao,
          posgraduacao: posgraduacao,
          formacao_complementar: formacaoComplementar,
          cargo_desejado: cargoDesejado,
          nucleo_de_trabalho: nucleoDeTrabalho,
          data_admissao: dataAdmissao,
          usuario: userId,
          servico: servicoId,
          pagamento: pagamentoId,
        });
      } else {
        await createAvaliacao({
          formacao_tecnica: formacaoTecnica,
          graduacao: graduacao,
          posgraduacao: posgraduacao,
          formacao_complementar: formacaoComplementar,
          cargo_desejado: cargoDesejado,
          nucleo_de_trabalho: nucleoDeTrabalho,
          data_admissao: dataAdmissao,
          usuario: userId,
          servico: servicoId,
          pagamento: pagamentoId,
        });
      }

      resetForm();
      setSelectedPagamento(null);

      const pagamentosData = await getPagamentosConcluidos();
      setPagamentos(pagamentosData);

      const avaliacoesData = {};
      for (let pagamento of pagamentosData) {
        const avaliacao = await getAvaliacao(pagamento.id);
        avaliacoesData[pagamento.id] = avaliacao;
      }
      setAvaliacoes(avaliacoesData);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setModalOpen(false);
    }
  };

  const handleVerAvaliacoes = (avaliacaoId) => {
    if (avaliacaoId) {
      history.push(`/avaliacao-view/${avaliacaoId}`);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Avaliações</h1>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Serviço</th>
              <th>Valor</th>
              <th>Avaliar</th>
              <th>Ver Avaliação</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.length > 0 ? (
              pagamentos.map((pagamento) => (
                <tr key={pagamento.id}>
                  <td>{pagamento.servico.nome || 'Carregando...'}</td>
                  <td>{pagamento.valor_liquido}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePagamentoSelect(pagamento)}
                    >
                      Avaliar
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleVerAvaliacoes(avaliacoes[pagamento.id]?.id)}
                      disabled={!avaliacoes[pagamento.id]}
                    >
                      Ver Avaliação
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Nenhum pagamento concluído encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedPagamento && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog" aria-labelledby="avaliacaoModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="avaliacaoModalLabel">Detalhes da Avaliação</h5>
                <button type="button" className="close" onClick={() => setModalOpen(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Serviço:</strong> {selectedPagamento.servico.nome}</p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group mt-3">
                    <label htmlFor="formacaoTecnica">Formação Técnica:</label>
                    <input type="text" className="form-control" value={formacaoTecnica} onChange={(e) => setFormacaoTecnica(e.target.value)} />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="graduacao">Graduação:</label>
                    <input type="text" className="form-control" value={graduacao} onChange={(e) => setGraduacao(e.target.value)} />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="posgraduacao">Pós-graduação:</label>
                    <input type="text" className="form-control" value={posgraduacao} onChange={(e) => setPosgraduacao(e.target.value)} />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="formacaoComplementar">Formação Complementar:</label>
                    <input type="text" className="form-control" value={formacaoComplementar} onChange={(e) => setFormacaoComplementar(e.target.value)} />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="cargoDesejado">Cargo Desejado:</label>
                    <input type="text" className="form-control" value={cargoDesejado} onChange={(e) => setCargoDesejado(e.target.value)} />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="nucleoDeTrabalho">Núcleo de Trabalho:</label>
                    <input type="text" className="form-control" value={nucleoDeTrabalho} onChange={(e) => setNucleoDeTrabalho(e.target.value)} />
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="dataAdmissao">Data de Admissão:</label>
                    <input type="date" className="form-control" value={dataAdmissao} onChange={(e) => setDataAdmissao(e.target.value)} />
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-success">Salvar Avaliação</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avaliacao;
