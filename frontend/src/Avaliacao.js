import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getPagamentosConcluidos, getAvaliacao, createAvaliacao, updateAvaliacao,analyzeAvaliacao } from './api';
import api from './api';
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

    const avaliacaoData = {
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
    };

    try {
      // Verifica se a avaliação já existe
      if (avaliacao) {
        await updateAvaliacao(avaliacao.id, avaliacaoData);
      } else {
        await createAvaliacao(avaliacaoData);
        console.log("aqui fica o create avaliacao")
        console.log(createAvaliacao)
      }

      // Análise da avaliação e criação do resultado
      const analyzeResult = await analyzeAvaliacao(avaliacaoData);
      console.log('Resultado da análise:', analyzeResult.analysis);

      const resultId = await createResult(analyzeResult);
      console.log("resulado depois de criado:" + resultId)
      await saveInitialBlocoAndTarefa(analyzeResult, resultId);

      // Lógica para resetar o formulário e carregar novas avaliações
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

// Função 'createResult' para criar o resultado no backend
const createResult = async (resultData) => {
  try {
    const postData = {
      avaliacao_id: avaliacao.id,
      validade: "2024-12-31",
      responsavel: '99',
      data_resultado: "2024-12-31"
    };
    console.log("Enviando postData:", postData);

    const response = await api.post('resultados/', postData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    console.log("Response data:", response.data); // Verifique a estrutura exata da resposta

    // Use um caminho seguro para acessar o id
    const idResultado = response.data?.idresultado; 
    if (idResultado) {
      return idResultado;
    } else {
      throw new Error('ID do resultado não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao criar resultado:', error);
    throw error;
  }
};


  const saveInitialBlocoAndTarefa = async (analyzeResult, resultId) => {
    try {
      console.log('Enviando dados para bloco:', {
        descricao: 'Bloco de Tratativa Inicial',
        resultado_id: resultId,
      });
      console.log('Token:', localStorage.getItem('token'));
  
      const blocoResponse = await api.post(
        'blocos/',
        {
          descricao: 'Bloco de Tratativa Inicial',
          resultado_id: resultId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Substitua com seu token de autenticação
          },
        }
      );
  
      if (blocoResponse.data && blocoResponse.data.idbloco) {
        const blocoId = blocoResponse.data.idbloco;
        console.log('Bloco ID recebido:', blocoId);
  
        const tarefaData = {
          tarefa: 'Tratativa Inicial',
          descricao: analyzeResult.analysis,
          aprendizado: 'Aprendizado inicial com base na análise.',
          prazo_registro: new Date().toISOString(),
          bloco_id: blocoId,
        };
        console.log('Enviando dados para tarefa:', tarefaData);
  
        await api.post('tarefas/', tarefaData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        throw new Error('ID do bloco não encontrado na resposta.');
      }
    } catch (error) {
      console.error('Erro ao criar bloco e tarefa iniciais:', error);
    }
  };
  
  const handleVerAvaliacoes = (avaliacaoId) => {
    if (avaliacaoId) {
      history.push(`/avaliacao-view/${avaliacaoId}`);
    }
  };

  return (
    <section className='vh-100'>
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
    </section>
  );
};

export default Avaliacao;