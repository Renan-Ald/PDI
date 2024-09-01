import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'; // Importando useHistory
import { getPagamentosConcluidos, getAvaliacao, createAvaliacao, updateAvaliacao } from './api';
import './Avaliacao.css';

const Avaliacao = () => {
  const history = useHistory(); // Instanciando history
  const [pagamentos, setPagamentos] = useState([]);
  const [selectedPagamento, setSelectedPagamento] = useState(null);
  const [avaliacao, setAvaliacao] = useState(null);
  const [formacaoTecnica, setFormacaoTecnica] = useState('');
  const [graduacao, setGraduacao] = useState('');
  const [posgraduacao, setPosgraduacao] = useState('');
  const [formacaoComplementar, setFormacaoComplementar] = useState('');
  const [cargoDesejado, setCargoDesejado] = useState('');
  const [nucleoDeTrabalho, setNucleoDeTrabalho] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const data = await getPagamentosConcluidos();
        setPagamentos(data);
      } catch (error) {
        console.error('Erro ao buscar pagamentos:', error);
      }
    };

    fetchPagamentos();
  }, []);

  const handlePagamentoSelect = async (pagamento) => {
    setSelectedPagamento(pagamento);
    setModalOpen(true);

    try {
      const avaliacaoExistente = await getAvaliacao(pagamento.id);
      console.log('ava', avaliacaoExistente);
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
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
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

      const data = await getPagamentosConcluidos();
      setPagamentos(data);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setModalOpen(false);
    }
  };

  // Função para redirecionar para a página de avaliações realizadas
  const handleVerAvaliacoes = () => {
    if (selectedPagamento) {
      history.push(`/avaliacoes/${selectedPagamento.usuario}`); // Substitua pelo caminho correto
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
              <th>Ações</th>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">Nenhum pagamento concluído encontrado.</td>
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
                  <button type="submit" className="btn btn-success mt-3">Salvar Avaliação</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botão para ver avaliações realizadas */}
      <button className="btn btn-secondary mt-4" onClick={handleVerAvaliacoes}>
        Ver Avaliações Realizadas
      </button>
    </div>
  );
};

export default Avaliacao;
