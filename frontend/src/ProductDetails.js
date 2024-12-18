import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getServicoById } from './api';
import ScrollReveal from 'scrollreveal';
import './ProductDetails.css';
import { useHistory } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getServicoById(id);
        setService(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do serviço:', error);
      }
    };

    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (service) {
      ScrollReveal().reveal('.reveal', {
        origin: 'left',
        distance: '50px',
        duration: 1000,
        easing: 'ease-in-out',
        reset: true,
      });
    }
  }, [service]);
  const handleHomeClick = () => {
    history.push(`/`);
  };
  if (!service) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      {/* Metade Esquerda: Imagem */}
      <div className="product-image">
        <div className="overlay">
          <h1 className="display-3 fw-bold text-light">Descubra {service.nome}</h1>
        </div>
      </div>

      {/* Metade Direita: Conteúdo */}
      <div className="product-content">
        <div className="details reveal">
          <h2 className="text-produto">{service.nome}</h2>
          <p className="text-produto">{service.descricao_longo}</p>
          <h4 className="text-produto">Preço: R$ {service.valor}</h4>
          <div className="about">
            <h3>Por que escolher este serviço?</h3>
            <p>
              Este serviço foi cuidadosamente desenvolvido para atender às suas necessidades. Ao optar por ele, você estará investindo
              em qualidade, eficiência e profissionalismo. Ideal para quem busca soluções práticas e resultados excepcionais!
            </p>
          </div>
          <button className="btn btn-primary back-button" onClick={() => handleHomeClick()}>
            <i className="bi bi-arrow-left"></i> Voltar à página principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
