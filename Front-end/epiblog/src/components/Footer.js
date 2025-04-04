import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import './Footer.css'; // Crea questo file per stili aggiuntivi

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Epiblog</h3>
          <p>Il tuo spazio per condividere storie, idee e passioni.</p>
        </div>
        
        <div className="footer-section">
          <h3>Link Utili</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/about">Chi Siamo</Link></li>
            <li><Link to="/contact">Contatti</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Seguici</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Epiblog. Tutti i diritti riservati.</p>
        <p>Realizzato con <FaHeart className="heart-icon" /> in Italia</p>
      </div>
    </footer>
  );
};

export default Footer;