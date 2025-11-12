import React, { useState, useEffect } from "react";
import "../CSS/Navbar.css";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className={`navbar ${isVisible ? "visible" : "hidden"}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <a href="/home">ZedCars</a>
        </div>

        <nav className="nav-menu">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/inventory">Inventory</a>

          {!user.isAuthenticated ? (
            <a href="/auth/login">Login</a>
          ) : (
            <>
              {user.role === 'Customer' && (
                <>
                  <a href="/purchaseaccessories">Accessories</a>
                  <a href="/my-testdrives">My Test Drives</a>
                  <a href="/my-purchases">My Purchases</a>
                </>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
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
        {user.isAuthenticated && user.role === "Customer" && (
          <a href="/my-testdrives" onClick={() => setIsMenuOpen(false)}>My Test Drives</a>
        )}
      </div>
    </header>
  );
};

export default Navbar;
