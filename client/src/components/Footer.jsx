import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import Logo from '../utils/Images/Logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Link to="/">
            <img src={Logo} alt="Foodeli" />
          </Link>
        </div>

        <div className="footer-section">
          <h3>Menu</h3>
          <Link to="/dishes?category=Pizza">Pizza</Link>
          <Link to="/dishes?category=Burger">Burgers</Link>
          <Link to="/dishes?category=Biryani">Biryani</Link>
          <Link to="/dishes?category=Dessert">Desserts</Link>
          <Link to="/dishes?category=Beverages">Beverages</Link>
        </div>

        <div className="footer-section">
          <h3>About</h3>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <Link to="/faq">FAQs</Link>
          <Link to="/track-order">Track Order</Link>
          <Link to="/delivery-info">Delivery Info</Link>
          <Link to="/refund-policy">Refund Policy</Link>
        </div>

        <div className="footer-cta">
          <h3>Partner with us</h3>
          <p>Grow your restaurant business with Foodeli</p>
          <Link to="/partner-with-us" className="learn-more-btn">Join Now</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="social-links">
          <p>Follow us</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} Foodeli. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
