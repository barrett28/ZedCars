import React from "react";
import "../CSS/Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-wave"></div>

      <div className="footer-content">
        <div className="footer-section about">
          <h2>ZedCars</h2>
          <p>
            Premium cars, trusted service, and unmatched experience.  
            Drive excellence with ZedCars — where performance meets perfection.
          </p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/inventory">Inventory</a></li>
            <li><a href="/purchaseaccessories">Purchase Accessories</a></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Location</h3>
          <p><i className="bi bi-pin-map"></i> Pune, Maharashtra</p>
          <p><i className="bi bi-telephone"></i> +91 98765 43210</p>
          <p><i className="bi bi-envelope align-items-center"></i> info@zedcars.com</p>
          <div className="footer-socials">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* <div className="footer-bottom">
        <p>© 2025 ZedCars. All rights reserved.</p>
      </div> */}
    </footer> 
  );
};

export default Footer;
