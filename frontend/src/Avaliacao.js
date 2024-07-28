import React, { useEffect, useState } from 'react';
import { getPagamentosConcluidos, getAvaliacao, createAvaliacao, updateAvaliacao, getServicoById } from './api';

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
  const [servicos, setServicos] = useState({}); // Mapeia IDs de serviços para nomes

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const data = await getPagamentosConcluidos();
        const servicosMap = {};

        for (const pagamento of data) {
          if (!servicosMap[pagamento.servico]) {
            const servico = await getServicoById(pagamento.servico);
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
    try {
      // Buscar a avaliação existente, se houver
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
    e.preventDefault();
    if (!selectedPagamento) {
      alert('Por favor, selecione um pagamento primeiro.');
      return;
    }
    try {
      if (avaliacao) {
        // Atualiza a avaliação existente
        await updateAvaliacao(avaliacao.id, {
          servico: selectedPagamento.servico,
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
        // Cria uma nova avaliação
        await createAvaliacao({
          servico: selectedPagamento.servico,
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
      // Atualizar lista de pagamentos
      const data = await getPagamentosConcluidos();
      setPagamentos(data);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    }
  };

  return (
    <div>
      <h1>Avaliações</h1>
      {!selectedPagamento ? (
        <div>
          <h2>Escolha um Serviço para Avaliar</h2>
          <ul>
            {pagamentos.length > 0 ? (
              pagamentos.map(pagamento => (
                <li key={pagamento.id}>
                  <h3>{servicos[pagamento.servico] || 'Carregando...'}</h3>
                  <p>Valor: {pagamento.valor_liquido}</p>
                  <button onClick={() => handlePagamentoSelect(pagamento)}>Selecionar</button>
                </li>
              ))
            ) : (
              <p>Nenhum pagamento concluído encontrado.</p>
            )}
          </ul>
        </div>
      ) : (
        <div>
          <h2>Avaliar Serviço: {servicos[selectedPagamento.servico] || 'Carregando...'}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Formação Técnica:</label>
              <input type="text" value={formacaoTecnica} onChange={(e) => setFormacaoTecnica(e.target.value)} />
            </div>
            <div>
              <label>Graduação:</label>
              <input type="text" value={graduacao} onChange={(e) => setGraduacao(e.target.value)} />
            </div>
            <div>
              <label>Pós-graduação:</label>
              <input type="text" value={posgraduacao} onChange={(e) => setPosgraduacao(e.target.value)} />
            </div>
            <div>
              <label>Formação Complementar:</label>
              <input type="text" value={formacaoComplementar} onChange={(e) => setFormacaoComplementar(e.target.value)} />
            </div>
            <div>
              <label>Cargo Desejado:</label>
              <input type="text" value={cargoDesejado} onChange={(e) => setCargoDesejado(e.target.value)} />
            </div>
            <div>
              <label>Núcleo de Trabalho:</label>
              <input type="text" value={nucleoDeTrabalho} onChange={(e) => setNucleoDeTrabalho(e.target.value)} />
            </div>
            <div>
              <label>Data de Admissão:</label>
              <input type="date" value={dataAdmissao} onChange={(e) => setDataAdmissao(e.target.value)} />
            </div>
            <button type="submit">{avaliacao ? 'Atualizar Avaliação' : 'Enviar Avaliação'}</button>
          </form>
          <button onClick={() => setSelectedPagamento(null)}>Voltar</button>
        </div>
      )}
    </div>
  );
};

export default Avaliacao;
