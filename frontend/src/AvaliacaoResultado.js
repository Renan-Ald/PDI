import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import api from './api';
import AuthContext from './AuthContext';
import './AvaliacaoResultado.css';
const AvaliacaoResultado = () => {
  const { id } = useParams();
  const { profissional } = useContext(AuthContext);
  const [resultado, setResultado] = useState(null);
  const [avaliacaoDetalhes, setAvaliacaoDetalhes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blocos, setBlocos] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (!profissional.token) {
      alert('Acesso negado. Esta área é restrita a profissionais.');
      history.push('/avaliador/login');
      return;
    }

    const fetchResultado = async () => {
      try {
        const response = await api.get(`resultados/?avaliacao_id=${id}`, {
          headers: {
            Authorization: `Bearer ${profissional.token}`,
          },
        });

        const resultadoFiltrado = response.data.find(result => result.avaliacao_id === parseInt(id));

        if (resultadoFiltrado) {
          setResultado(resultadoFiltrado);
          fetchAvaliacaoDetalhes(resultadoFiltrado.avaliacao_id);
          fetchBlocos(resultadoFiltrado.idresultado);
        } else {
          setError('Nenhum resultado encontrado para esta avaliação.');
        }
      } catch (error) {
        console.error('Erro ao buscar resultado:', error);
        setError('Não foi possível carregar o resultado.');
      } finally {
        setLoading(false);
      }
    };

    const fetchAvaliacaoDetalhes = async (avaliacaoId) => {
      try {
        const response = await api.get(`avaliacoes/${avaliacaoId}`, {
          headers: {
            Authorization: `Bearer ${profissional.token}`,
          },
        });
        setAvaliacaoDetalhes(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes da avaliação:', error);
        setError('Não foi possível carregar os detalhes da avaliação.');
      }
    };

    const fetchBlocos = async (resultadoId) => {
      try {
        const response = await api.get(`blocos/?resultado_id=${resultadoId}`, {
          headers: {
            Authorization: `Bearer ${profissional.token}`,
          },
        });

        const blocosComTarefas = await Promise.all(response.data.map(async (bloco) => {
          const tarefasResponse = await api.get(`tarefas/?bloco_id=${bloco.idbloco}`, {
            headers: {
              Authorization: `Bearer ${profissional.token}`,
            },
          });
          return {
            ...bloco,
            tarefas: tarefasResponse.data,
          };
        }));

        setBlocos(blocosComTarefas);
      } catch (error) {
        console.error('Erro ao buscar blocos:', error);
        setError('Não foi possível carregar os blocos.');
      }
    };

    fetchResultado();
  }, [id, profissional.token, history]);

  const handleAddBloco = () => {
    const novoBloco = {
      descricao: `Bloco ${blocos.length + 1}`,
      tarefas: [],
    };
    setBlocos([...blocos, novoBloco]);
  };

  const handleAddTarefa = (index) => {
    const novaTarefa = {
      tarefa: '',
      prazo_registro: '',
      descricao: '',
      aprendizado: '',
    };
    const novosBlocos = [...blocos];
    novosBlocos[index].tarefas.push(novaTarefa);
    setBlocos(novosBlocos);
  };

  const handleChangeTarefa = (blocoIndex, tarefaIndex, field, value) => {
    const novosBlocos = [...blocos];

    if (field === 'prazo_registro') {
      const date = new Date(value);
      if (!isNaN(date)) {
        date.setHours(9, 0, 0);
        novosBlocos[blocoIndex].tarefas[tarefaIndex][field] = date.toISOString();
      } else {
        novosBlocos[blocoIndex].tarefas[tarefaIndex][field] = '';
      }
    } else {
      novosBlocos[blocoIndex].tarefas[tarefaIndex][field] = value;
    }
    setBlocos(novosBlocos);
  };

  const handleSubmitBloco = async (bloco, resultadoId) => {
    try {
      const response = await api.post('blocos/', {
        descricao: bloco.descricao,
        resultado_id: resultadoId,
      }, {
        headers: {
          Authorization: `Bearer ${profissional.token}`,
        },
      });
      if (response.data && response.data.idbloco) {
        return response.data.idbloco;
      } else {
        throw new Error('ID do bloco não encontrado na resposta.');
      }
    } catch (error) {
      console.error('Erro ao criar bloco:', error);
      return null;
    }
  };

  const handleSubmitTarefa = async (tarefa, blocoId) => {
    try {
      if (!tarefa.tarefa || !tarefa.prazo_registro || !tarefa.aprendizado) {
        throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
      }
      const response = await api.post('tarefas/', {
        tarefa: tarefa.tarefa,
        prazo_registro: tarefa.prazo_registro,
        descricao: tarefa.descricao,
        aprendizado: tarefa.aprendizado,
        bloco_id: blocoId,
      }, {
        headers: {
          Authorization: `Bearer ${profissional.token}`,
        },
      });

      console.log('Tarefa criada:', response.data);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  const handleSave = async () => {
    for (let i = 0; i < blocos.length; i++) {
      const blocoId = await handleSubmitBloco(blocos[i], resultado.idresultado);
      if (!blocoId) {
        console.error('Erro ao criar bloco, interrompendo a criação de tarefas.');
        return;
      }
      for (let j = 0; j < blocos[i].tarefas.length; j++) {
        await handleSubmitTarefa(blocos[i].tarefas[j], blocoId);
      }
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="vh-100">
    <div className='av-result'>
    <div className="container">
      <h1 className="mt-4">Avaliação</h1>
      
      {avaliacaoDetalhes && (
        <div className="card mb-4">
          <div className="card-body">
            <h2>Detalhes da Avaliação</h2>
            <p><strong>Formação Técnica:</strong> {avaliacaoDetalhes.formacao_tecnica}</p>
            <p><strong>Graduação:</strong> {avaliacaoDetalhes.graduacao}</p>
            <p><strong>Data de Admissão:</strong> {avaliacaoDetalhes.data_admissao}</p>
          </div>
        </div>
      )}

      <h2>Blocos e Tarefas</h2>
      {blocos.map((bloco, index) => (
        <div className="card mb-3" key={index}>
          <div className="card-body">
            <h3>{bloco.descricao}</h3>
            {bloco.tarefas.map((tarefa, tarefaIndex) => (
              <div className="mb-3" key={tarefaIndex}>
                <input
                  type="text"
                  className=" registro form-control mb-2"
                  placeholder="Tarefa"
                  value={tarefa.tarefa}
                  onChange={(e) => handleChangeTarefa(index, tarefaIndex, 'tarefa', e.target.value)}
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  placeholder="realizado"
                  value={tarefa.prazo_registro ? tarefa.prazo_registro.slice(0, 10) : ''}
                  onChange={(e) => handleChangeTarefa(index, tarefaIndex, 'prazo_registro', e.target.value)}
                />
                  <textarea
                    className="form-control mb-2"
                    placeholder="Descrição"
                    value={tarefa.descricao}
                    onChange={(e) => handleChangeTarefa(index, tarefaIndex, 'descricao', e.target.value)}
                    rows={4} // Ajuste o número de linhas conforme necessário
                  ></textarea>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Aprendizado"
                  value={tarefa.aprendizado}
                  onChange={(e) => handleChangeTarefa(index, tarefaIndex, 'aprendizado', e.target.value)}
                />
              </div>
            ))}
            <button className="btn btn-primary" onClick={() => handleAddTarefa(index)}>Adicionar Tarefa</button>
          </div>
        </div>
      ))}
      <button className="btn btn-success" onClick={handleAddBloco}>Adicionar Bloco</button>
      <button className="btn btn-primary mt-3" onClick={handleSave}>Salvar</button>
    </div>
    </div>
    </section>
  );
};

export default AvaliacaoResultado;
