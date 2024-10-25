import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';
import AuthContext from './AuthContext';
import './AvaliacaoView.css';

const AvaliacaoView = () => {
  const { id } = useParams();
  const { profissional } = useContext(AuthContext);
  const [resultado, setResultado] = useState(null);
  const [blocos, setBlocos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, [id, profissional.token]);

  if (loading) {
    return <p className="avaliacao-view-loading">Carregando...</p>;
  }

  if (error) {
    return <p className="avaliacao-view-error">{error}</p>;
  }

  return (
    <section className='vh-100'>
    <div className="avaliacao-view">
      <div className="avaliacao-container mt-5">
        <h2 className="avaliacao-title text-center mb-4">Visualização da Avaliação</h2>

        {blocos.map((bloco, index) => (
          <div className="avaliacao-card card mb-4 shadow-sm" key={index}>
            <div className="ava-view card-body">
              <h3 className="avaliacao-bloco-title card-title">{bloco.descricao}</h3>
              <ul className=" li-view avaliacao-tarefas list-group list-group-flush">
                {bloco.tarefas.map((tarefa, tarefaIndex) => (
                  <li className=" li-view avaliacao-tarefa-item" key={tarefaIndex}>
                    <h5>{tarefa.tarefa}</h5>
                    <p><strong>Prazo:</strong> {new Date(tarefa.prazo_registro).toLocaleDateString()}</p>
                    <p><strong>Descrição:</strong> {tarefa.descricao}</p>
                    <p><strong>Aprendizado:</strong> {tarefa.aprendizado}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default AvaliacaoView;
