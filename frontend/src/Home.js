import React, { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import { fetchServices, addToCart } from './api';
import heroImg from './img/home_4.jpg';
import tick from './img/tick.png';
import validation from './img/carer.jpg';
import marketer from './img/marketer.png';
import manager from './img/pdi.webp';
import './Home.css';
import { useHistory } from 'react-router-dom';
const Home = () => {
  const [services, setServices] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Configuração do ScrollReveal
    ScrollReveal().reveal(
      '.hero, .sub-home-list li, .section-validation, .section-manager, .section-products, .section-marketer',
      {
        distance: '50px',
        duration: 1000,
        easing: 'ease-out',
        origin: 'bottom',
        interval: 200, // Intervalo entre os elementos
      }
    );

    const fetchServicesData = async () => {
      try {
        const data = await fetchServices(); // API para buscar serviços
        setServices(data);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    };

    fetchServicesData();
  }, []);

  const handleProductClick = (serviceId) => {
    history.push(`/produto/${serviceId}`);
  };
  const handleAddToCart = async (servicoId) => {
    try {
      const response = await addToCart(servicoId, 1); // Quantidade padrão de 1
      console.log('Resposta da API ao adicionar ao carrinho:', response);
      alert('Serviço adicionado ao carrinho!');
    } catch (error) {
      console.error(
        'Erro ao adicionar ao carrinho:',
        error.response?.data || error.message
      );
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  return (
    <div id='topo' className="home">
      <section  className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">lorem ipsum</h1>
              <p className="hero-description">
                dolor sit amet consectetur adipisicing elit.<br />
                Fugit accusantium nulla quis atque consequuntur culpa ad voluptates pariatur magni ducimus fugiat et libero<br />
                your next user experience.
              </p>
                <a className="btn btn-primary btn-pulse" href="#products">COMPRE AGORA</a>
            </div>
            <div className="hero-image">
              <img src={heroImg} alt="Hero" />
            </div>
          </div>
        </div>
      </section>
      <section className='sub-home'>
      <ul className='sub-home-list'>
        <li><i class="bi bi-check-circle"></i> ACESSO IMEDIATO</li>
        <li><i class="bi bi-shield-check"></i> COMPRA SEGURA</li>
        <li> <i class="bi bi-patch-check"></i> 7 DIAS DE GARANTIA</li>
        <br></br>
      </ul>
</section>
      

      <section className="section-validation" id="validation">
        <div className="container">
          <div className="validation-content">
            <div className="validation-text">
              <h5>Lorem ipsum, dolor sit amet consectetur adipisicing elit</h5>
              <h2>Design Professionals</h2>
              <p>The Myspace page defines the individual, his or her characteristics, traits, personal choices and the overall<br />personality of the person.</p>
              <h4 className='txt_gradiente'>Accessory makers</h4>
              <p>While most people enjoy casino gambling, sports betting,<br />lottery and bingo playing for the fun</p>
              <h4 className='txt_gradiente'>Alterationists</h4>
              <p>If you are looking for a new way to promote your business<br />that won't cost you money,</p>
              <h4 className='txt_gradiente'>Custom Design designers</h4>
              <p>If you are looking for a new way to promote your business<br />that won't cost you more money,</p>
            </div>
            <div className="validation-image">
              <img className='Validation'src={validation} alt="Validation" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-manager" id="manager">
        <div className="container">
          <div className="manager-content">
            <div className="manager-image">
              <img className='Manager' src={manager} alt="Manager" />
            </div>
            <div className="manager-text">
              <h5>Easier decision making for</h5>
              <p>Product Managers</p>
              <p>The Myspace page defines the individual, his or her characteristics, traits, personal choices and the overall<br />personality of the person.</p>
              <div className="benefits">
                <div className="benefit">
                  <img src={tick} alt="tick" />
                  <p>Never worry about overpaying for your<br />energy again.</p>
                </div>
                <div className="benefit">
                  <img src={tick} alt="tick" />
                  <p>We will only switch you to energy companies<br />that we trust and will treat you right</p>
                </div>
                <div className="benefit">
                  <img src={tick} alt="tick" />
                  <p>We track the markets daily and know where the<br />savings are.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-products" id="products">
        <div className="container">
          <div className="section-header">
            <h1>Produtos</h1>
          </div>
          <div className="product-list">
            {services.map((service) => (
              <div
                className="product-card"
                key={service.id}
                onClick={() => handleProductClick(service.id)}
              >
                <div className="product-info">
                  <h2 className="product-title">{service.descricao}</h2>
                  <h3 className="product-title">{service.nome}</h3>
                  <h4 className="product-price">R${formatCurrency(service.valor)}</h4>
                  <button
                    className="btn btn-cart"
                    onClick={(e) => {
                      e.stopPropagation(); // Evita redirecionamento no clique do botão
                      handleAddToCart(service.id);
                    }}
                  >
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-marketer" id="marketer">
        <div className="container">
          <div className="marketer-content">
            <div className="marketer-text">
              <h5>Optimisation for</h5>
              <p>Marketers</p>
              <p>Few would argue that, despite the advancements of<br />feminism over the past three decades, women still face a<br />double standard when it comes to their behavior.</p>
              <h4 className='txt_gradiente'>Accessory makers</h4>
              <p>While most people enjoy casino gambling, sports betting,<br />lottery and bingo playing for the fun</p>
              <h4 className='txt_gradiente'>Alterationists</h4>
              <p>If you are looking for a new way to promote your business<br />that won't cost you money,</p>
              <h4 className='txt_gradiente' >Custom Design designers</h4>
              <p>If you are looking for a new way to promote your business<br />that won't cost you more money,</p>
            </div>
            <div className="marketer-image">
              <img src={marketer} alt="Marketer" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
