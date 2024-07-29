// src/Home.js
import React, { useState, useEffect } from 'react';
import { fetchServices, addToCart } from './api';
import heroImg from './img/hero-img.png';
import './Home.css';
const Home = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    };

    fetchServicesData();
  }, []);

  const handleAddToCart = async (servicoId) => {
    try {
      const response = await addToCart(servicoId, 1); // Quantidade padrão de 1
      console.log('Resposta da API ao adicionar ao carrinho:', response);
      alert('Serviço adicionado ao carrinho!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error.response?.data || error.message);
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
      <div className="col-md-6 text-md-start text-center py-6">
        <h1 className="mb-4 fs-9 fw-bold">lorem ipsum</h1>
        <p className="mb-6 lead text-secondary">
        dolor sit amet consectetur adipisicing elit.<br className="d-none d-xl-block" />
        Fugit accusantium nulla quis atque consequuntur culpa ad voluptates pariatur magni ducimus fugiat et libero<br className="d-none d-xl-block" />
          your next user experience.
        </p>
        <div className="text-center text-md-start">
        <a className="btn btn-light-blue me-3 btn-lg" href="#!" role="button">Get started</a>
        </div>
      </div>
      <div className="col-md-6 text-end">
        <img className="pt-7 pt-md-0 img-fluid" src={heroImg} alt="Hero" />
      </div>
    </div>
  </div>
</section>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Serviços Disponíveis</h1>
        <div className="row">
          {services.map((service) => (
            <div className="col-md-4 mb-4" key={service.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{service.nome}</h5>
                  <p className="card-text">{service.descricao}</p>
                  <p className="card-text"><strong>Preço: R${service.valor}</strong></p>
                  <button className="btn btn-primary" onClick={() => handleAddToCart(service.id)}>
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
