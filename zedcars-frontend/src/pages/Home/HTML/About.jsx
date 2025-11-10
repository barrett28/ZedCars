import React from "react";
import "../CSS/About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">Zed<span>Cars</span></h1>
        <p className="about-subtitle">
          ZedCars is a premier vehicle inventory management system designed to help dealerships
          manage their vehicle inventory efficiently.
        </p>

        <div className="about-section">
          <h2><i className="bi bi-bullseye"></i> Our Mission</h2>
          <p>
            To provide the best vehicle inventory management experience for both dealers and
            customers — streamlining operations and enhancing satisfaction.
          </p>
        </div>

        <div className="about-section features">
          <h2><i className="bi bi-star-fill"></i> Key Features</h2>
          <ul>
            <li><i className="bi bi-check-circle-fill"></i> Comprehensive vehicle inventory management</li>
            <li><i className="bi bi-check-circle-fill"></i> User-friendly interface</li>
            <li><i className="bi bi-check-circle-fill"></i> Real-time stock tracking</li>
            <li><i className="bi bi-check-circle-fill"></i> Detailed vehicle information</li>
            <li><i className="bi bi-check-circle-fill"></i> Advanced search and filtering</li>
          </ul>
        </div>

        <div className="about-highlights">
          <div className="highlight-item">
            <i className="bi bi-people-fill"></i>
            <h4>Customer Focused</h4>
            <p>Dedicated to providing exceptional service.</p>
          </div>
          <div className="highlight-item">
            <i className="bi bi-shield-check"></i>
            <h4>Reliable & Secure</h4>
            <p>Built with security and reliability in mind.</p>
          </div>
          <div className="highlight-item">
            <i className="bi bi-lightning-fill"></i>
            <h4>Fast & Efficient</h4>
            <p>Optimized for speed and performance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
