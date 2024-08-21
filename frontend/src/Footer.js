import React from 'react';
import './footer.css'; 

const Footer = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
      <footer className='footer-main'>
      <section className="footer-section pb-2">
        
        <div className="container">
          <div className="row border-top border-top-secondary pt-3">
            <div className="col-lg-3 col-md-6 mb-3">
              <img className="mb-2" src="assets/img/logo.svg" width="100" alt="Logo" />
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <p className="fs-6 mb-2">Quick Links</p>
              <ul className="list-unstyled mb-0">
                <li className="mb-1"><a className="link-900 text-secondary text-decoration-none" href="#!">About us</a></li>
                <li className="mb-1"><a className="link-900 text-secondary text-decoration-none" href="#!">Blog</a></li>
                
              </ul>
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <p className="fs-6 mb-2">Legal stuff</p>
              <ul className="list-unstyled mb-0">
              <li className="mb-1"><a className="link-900 text-secondary text-decoration-none" href="#!">Contact</a></li>
              <li className="mb-1"><a className="link-900 text-secondary text-decoration-none" href="#!">FAQ</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <p className="fs-6 mb-2">Stay Updated</p>
              <form className="mb-2">
                <input className="form-control form-control-sm" type="email" placeholder="Enter your email" aria-label="email" />
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center py-2">
        <div className="container">
          <div className="border-top py-2">
            <div className="row justify-content-between">
              <div className="col-12 col-md-auto mb-1 mb-md-0">
                <p className="mb-0">&copy; 2024 Renan Inc</p>
              </div>
              <div className="col-12 col-md-auto">
                <p className="mb-0">
                  Made with <span className="fas fa-heart mx-1 text-danger"></span> by <a className="bi bi-heart-fill" href="#!" target="_blank" rel="noopener noreferrer"> DEV</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </section>
      </footer>
    </>
  );
};

export default Footer;
