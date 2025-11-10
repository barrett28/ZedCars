import React, { useState, useEffect } from "react";
import "../CSS/Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 10) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`navbar ${isVisible ? "visible" : "hidden"}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <a href="/home">ZedCars</a>
        </div>

        <nav className="nav-menu">
          <a href="/inventory">Inventory</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/auth/login">Login</a>
        </nav>

        <button
          className={`nav-toggle ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`mobile-nav ${isMenuOpen ? "active" : ""}`}>
        <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
        <a href="#inventory" onClick={() => setIsMenuOpen(false)}>Inventory</a>
        <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
        <a href="#financing" onClick={() => setIsMenuOpen(false)}>Financing</a>
        <a href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
      </div>
    </header>
  );
};

export default Navbar;
