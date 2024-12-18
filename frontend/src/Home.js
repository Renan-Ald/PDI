import React, { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import { fetchServices, addToCart } from './api';
import heroImg from './img/home_4.jpg';
import tick from './img/tick.png';
import validation from './img/PDI-768x483.webp';
import manager from './img/pdi.webp';
import marketer from './img/marketer.png';
import './Home.css';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const [services, setServices] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Configuração do ScrollReveal
    ScrollReveal().reveal(
      '.hero, .sub-home-list li, .section-validation, .section-manager, .section-products, .section-marketing',
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
      currency: 'BRL',
    });
  };

  return (
    <div id='topo' className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Inovação, Pesquisa e Desenvolvimento</h1>
              <p className="hero-description">
                Nosso sistema entrega resultados concretos com a análise avançada de dados por meio de IA treinada.<br />
                Ele é projetado para transformar suas operações com insights inteligentes e soluções baseadas em dados.<br />
                Junte-se a nós e descubra como a inteligência artificial pode otimizar sua tomada de decisão e impulsionar seu sucesso.
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
          <li><i className="bi bi-check-circle"></i> ACESSO IMEDIATO</li>
          <li><i className="bi bi-shield-check"></i> COMPRA SEGURA</li>
          <li><i className="bi bi-patch-check"></i> 7 DIAS DE GARANTIA</li>
          <br />
        </ul>
      </section>

      <section className="section-validation" id="validation">
        <div className="container">
          <div className="validation-content">
            <div className="validation-text">
              <h5>Transformando Decisões com Inteligência Artificial</h5>
              <h2>Pesquisa, Desenvolvimento e Inovação</h2>
              <p>Com a aplicação de IA treinada, nosso sistema oferece insights profundos e soluções inovadoras para otimizar seus processos e decisões de negócios.</p>
              <h4 className='txt_gradiente'>Análise Preditiva</h4>
              <p>Utilizamos IA para prever tendências de mercado, comportamentos de consumidores e outras variáveis, ajudando sua empresa a se antecipar e tomar decisões mais assertivas.</p>
              <h4 className='txt_gradiente'>Processamento Inteligente de Dados</h4>
              <p>Com a capacidade de processar grandes volumes de dados, nossa solução extrai informações valiosas para seu negócio, garantindo resultados rápidos e precisos.</p>
              <h4 className='txt_gradiente'>Automação de Processos</h4>
              <p>Automatizamos processos complexos com IA, aumentando a eficiência e reduzindo erros, o que permite que sua empresa seja mais ágil e competitiva.</p>
            </div>
            <div className="validation-image">
              <img className='Validation' src={validation} alt="Validation" />
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
              <h5>Otimize Seus Processos com IA</h5>
              <p>Nosso sistema oferece soluções de IA para ajudar gerentes e líderes de negócios a tomar decisões estratégicas com base em dados concretos.</p>
              <p>Com a experiência de profissionais especializados e a integração de IA treinada, nosso sistema transforma suas operações, garantindo um desempenho superior e uma gestão eficiente.</p>
              <div className="benefits">
                <div className="benefit">
                  <img src={tick} alt="tick" />
                  <p>Transforme dados em decisões estratégicas com IA.</p>
                </div>
                <div className="benefit">
                  <img src={tick} alt="tick" />
                  <p>Automatize processos e aumente a eficiência.</p>
                </div>
                <div className="benefit">
                  <img src={tick} alt="tick" />
                  <p>Obtenha insights rápidos e precisos para melhorar seu desempenho.</p>
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
        <h5>Especialista em Pesquisa, Desenvolvimento e Inovação (PDI)</h5>
        <p>Professora Yolete: Referência em PDI</p>
        <p>A professora Yolete é uma renomada especialista em Pesquisa, Desenvolvimento e Inovação (PDI), com décadas de experiência na área acadêmica e prática. Com um vasto conhecimento em metodologias inovadoras, ela tem se destacado por sua capacidade de aplicar a teoria à prática de forma transformadora, impactando diretamente o setor de PDI e moldando a próxima geração de profissionais.</p>
        <h4 className='txt_gradiente'>Líder Acadêmica em PDI</h4>
        <p>Com uma sólida formação acadêmica e um extenso histórico de projetos de inovação, Yolete tem contribuído de forma significativa para o avanço do PDI no Brasil e no exterior. Sua expertise em estratégias de pesquisa aplicada e desenvolvimento de novas soluções tem sido fundamental para grandes transformações em diversas indústrias.</p>
        <h4 className='txt_gradiente'>Inovação e Transformação</h4>
        <p>Além de sua contribuição acadêmica, Yolete tem liderado iniciativas de pesquisa aplicada em colaboração com empresas e instituições de ensino, buscando sempre promover a inovação tecnológica, sustentável e socialmente responsável. Seu trabalho tem sido essencial na criação de novas tecnologias e modelos de negócios, que impulsionam a inovação em diferentes setores.</p>
        <h4 className='txt_gradiente'>Mentoria e Formação</h4>
        <p>Como mentora e educadora, a professora Yolete tem sido fundamental para a formação de profissionais altamente capacitados em PDI. Ela dedica-se ao ensino de estratégias de pesquisa e desenvolvimento, orientando seus alunos e colegas de profissão em práticas que fomentam a criatividade, o pensamento crítico e a solução de problemas complexos.</p>
        <h4 className='txt_gradiente'>Impacto no Futuro da Inovação</h4>
        <p>Com sua visão voltada para o futuro, Yolete continua a influenciar o cenário de PDI, ajudando a moldar uma nova era de inovação com foco em soluções que atendam às demandas do mercado global. Sua abordagem interdisciplinar e seu compromisso com a excelência a tornam uma das maiores referências na área de Pesquisa, Desenvolvimento e Inovação.</p>
      </div>
      <div className="marketer-image">
        <img src={marketer} alt="Professora Yolete" />
      </div>
    </div>
  </div>
</section>

    </div>
  );
};

export default Home;
