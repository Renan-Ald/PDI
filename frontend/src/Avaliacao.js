import React, { useEffect, useState } from 'react';
import { getPagamentosConcluidos, getAvaliacao, createAvaliacao, updateAvaliacao, getServicoById } from './api';
import './Avaliacao.css'; // Certifique-se de ter o CSS para ajustes de estilo

const Avaliacao = () => {
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
  const [servicos, setServicos] = useState({});
  const [modalOpen, setModalOpen] = useState(false); // Controle do estado do modal

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const data = await getPagamentosConcluidos();
        const servicosMap = {};

        for (const pagamento of data) {
          if (!servicosMap[pagamento.servico]) {
            const servico = await getServicoById(pagamento.servico.id);
            servicosMap[pagamento.servico] = servico.nome;
          }
        }

        setPagamentos(data);
        setServicos(servicosMap);
      } catch (error) {
        console.error('Erro ao buscar pagamentos ou serviços:', error);
      }
    };

    fetchPagamentos();
  }, []);

  const handlePagamentoSelect = async (pagamento) => {
    setSelectedPagamento(pagamento);
    setModalOpen(true); // Abre o modal
    try {
      const existingAvaliacao = await getAvaliacao(pagamento.id);
      setAvaliacao(existingAvaliacao);

      if (existingAvaliacao) {
        setFormacaoTecnica(existingAvaliacao.formacao_tecnica);
        setGraduacao(existingAvaliacao.graduacao);
        setPosgraduacao(existingAvaliacao.posgraduacao);
        setFormacaoComplementar(existingAvaliacao.formacao_complementar);
        setCargoDesejado(existingAvaliacao.cargo_desejado);
        setNucleoDeTrabalho(existingAvaliacao.nucleo_de_trabalho);
        setDataAdmissao(existingAvaliacao.data_admissao);
      } else {
        setFormacaoTecnica('');
        setGraduacao('');
        setPosgraduacao('');
        setFormacaoComplementar('');
        setCargoDesejado('');
        setNucleoDeTrabalho('');
        setDataAdmissao('');
      }
    } catch (error) {
      console.error('Erro ao buscar avaliação existente:', error);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Certifique-se de que o evento é recebido
    if (!selectedPagamento) {
      alert('Por favor, selecione um pagamento primeiro.');
      return;
    }
    try {
      if (avaliacao) {
        await updateAvaliacao(avaliacao.id, {
          servico: selectedPagamento.servico.id,
          pagamento: selectedPagamento.id,
          formacao_tecnica: formacaoTecnica,
          graduacao: graduacao,
          posgraduacao: posgraduacao,
          formacao_complementar: formacaoComplementar,
          cargo_desejado: cargoDesejado,
          nucleo_de_trabalho: nucleoDeTrabalho,
          data_admissao: dataAdmissao,
        });
      } else {
        await createAvaliacao({
          servico: selectedPagamento.servico.id,
          pagamento: selectedPagamento.id,
          formacao_tecnica: formacaoTecnica,
          graduacao: graduacao,
          posgraduacao: posgraduacao,
          formacao_complementar: formacaoComplementar,
          cargo_desejado: cargoDesejado,
          nucleo_de_trabalho: nucleoDeTrabalho,
          data_admissao: dataAdmissao,
        });
      }
      // Limpar campos após envio
      setFormacaoTecnica('');
      setGraduacao('');
      setPosgraduacao('');
      setFormacaoComplementar('');
      setCargoDesejado('');
      setNucleoDeTrabalho('');
      setDataAdmissao('');
      setSelectedPagamento(null);
      setAvaliacao(null);
      const data = await getPagamentosConcluidos();
      setPagamentos(data);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setModalOpen(false); // Fecha o modal após o envio
    }
  };

  return (
    <div className="container mt-5">
      <h1>Avaliações</h1>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className='tr-av'>
            <tr >
              <th>Serviço</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className='tr-av' > 
            {pagamentos.length > 0 ? (
              pagamentos.map((pagamento) => (
                <tr key={pagamento.id}>
                  <td>{servicos[pagamento.servico] || 'Carregando...'}</td>
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

      {/* Modal para Avaliação */}
      {modalOpen && (
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
                <p><strong>Serviço:</strong> {servicos[selectedPagamento?.servico]}</p>
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
                    <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Fechar</button>
                    <button type="submit" className="btn btn-primary">Enviar Avaliação</button>
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
