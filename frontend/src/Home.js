// src/Home.js
import React, { useState, useEffect } from 'react';
import { fetchServices, addToCart } from './api';
import heroImg from './img/hero-img.png';
import tick from './img/tick.png';
import validation from './img/validation.png';
import marketer from './img/marketer.png';
import manager from './img/manager.png';
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
<section class="section-products">
  <div class="container">
    <div class="row justify-content-center text-center">
      <div class="col-md-8 col-lg-6">
        <div class="header">
        <h1 className="mb-4 fs-9 fw-bold">Product</h1>
        </div>
      </div>
    </div>
    <div class="row">
      
      {services.map((service) => (
        <div class="col-md-6 col-lg-4 col-xl-3" key={service.id}>
          <div id={`product-${service.id}`} class="single-product">
            <div class="part-1">
              <span class="new">new</span>
              <ul>
                <li><a onClick={() => handleAddToCart(service.id)}><i class="bi bi-cart-fill"></i></a></li>
                <li><a href="#"><i class="bi bi-heart-fill"></i></a></li>
              </ul>
            </div>
            <div class="part-2">
              <h3 class="product-title">{service.nome}</h3>
              <h4 class="product-price">R${service.valor}</h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
      <section class="pt-5" id="validation">

        <div class="container">
          <div class="row">
            <div class="col-lg-6">
              <h5 class="text-secondary">Lorem ipsum, dolor sit amet consectetur adipisicing elit</h5>
              <h2 class="mb-2 fs-7 fw-bold">Design Professionals</h2>
              <p class="mb-4 fw-medium text-secondary">
                The Myspace page defines the individual,his or her
                characteristics, traits, personal choices and the overall<br />personality of the person.
              </p>
              <h4 class="fs-1 fw-bold">Accessory makers</h4>
              <p class="mb-4 fw-medium text-secondary">While most people enjoy casino gambling, sports betting,<br />lottery and bingo playing for the fun</p>
              <h4 class="fs-1 fw-bold">Alterationists</h4>
              <p class="mb-4 fw-medium text-secondary">If you are looking for a new way to promote your business<br />that won't cost you money,</p>
              <h4 class="fs-1 fw-bold">Custom Design designers</h4>
              <p class="mb-4 fw-medium text-secondary">If you are looking for a new way to promote your business<br />that won't cost you more money,</p>
            </div>
            <div class="col-lg-6"><img class="img-fluid" src={validation} alt="" /></div>
          </div>
        </div>
      </section>
      <section class="pt-5" id="manager">

        <div class="container">
          <div class="row">
            <div class="col-lg-6"><img class="img-fluid" src={manager} alt="" /></div>
            <div class="col-lg-6">
              <h5 class="text-secondary">Easier decision making for</h5>
              <p class="fs-7 fw-bold mb-2">Product Managers</p>
              <p class="mb-4 fw-medium text-secondary">
                The Myspace page defines the individual,his or her
                characteristics, traits, personal choices and the overall<br />personality of the person.
              </p>
              <div class="d-flex align-items-center mb-3"> <img class="me-sm-4 me-2" src={tick} width="35" alt="tick" />
                <p class="fw-medium mb-0 text-secondary">Never worry about overpaying for your<br />energy again.</p>
              </div>
              <div class="d-flex align-items-center mb-3"> <img class="me-sm-4 me-2" src={tick} width="35" alt="tick" />
                <p class="fw-medium mb-0 text-secondary">We will only switch you to energy companies<br />that we trust and will treat you right</p>
              </div>
              <div class="d-flex align-items-center mb-3"><img class="me-sm-4 me-2" src={tick} width="35" alt="tick" />
                <p class="fw-medium mb-0 text-secondary"> We track the markets daily and know where the<br />savings are.</p>
              </div>
            </div>
          </div>
        </div>

      </section>
      <section class="pt-5" id="marketer">

        <div class="container">
          <div class="row">
            <div class="col-lg-6">
              <h5 class="text-secondary">Optimisation for</h5>
              <p class="mb-2 fs-8 fw-bold">Marketers</p>
              <p class="mb-4 fw-medium text-secondary">Few would argue that, despite the advancements of<br />feminism over the past three decades, women still face a<br />double standard when it comes to their behavior.</p>
              <h4 class="fw-bold fs-1">Accessory makers</h4>
              <p class="mb-4 fw-medium text-secondary">While most people enjoy casino gambling, sports betting,<br />lottery and bingo playing for the fun</p>
              <h4 class="fw-bold fs-1">Alterationists</h4>
              <p class="mb-4 fw-medium text-secondary">If you are looking for a new way to promote your business<br />that won't cost you money,</p>
              <h4 class="fw-bold fs-1">Custom Design designers</h4>
              <p class="mb-4 fw-medium text-secondary">If you are looking for a new way to promote your business<br />that won't cost you more money,</p>
            </div>
            <div class="col-lg-6"><img class="img-fluid"  src={marketer}  alt="" /></div>
          </div>
        </div>
      </section>

    
    </div>
    
  );
};

export default Home;
