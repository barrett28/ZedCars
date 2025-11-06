import React, { useEffect, useState } from "react";
import gsap from "gsap";
import "../../layout/CSS/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const menu = document.getElementById("dropdownMenu");
    if (!menu) return;

    gsap.set(menu, { y: -20, opacity: 0, display: "none" });

    if (isOpen) {
      gsap.to(menu, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power4.out",
        display: "block",
      });
    } else {
      gsap.to(menu, {
        y: -20,
        opacity: 0,
        duration: 0.4,
        ease: "power4.in",
        onComplete: () => (menu.style.display = "none"),
      });
    }
  }, [isOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className={`menu-btn ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Menu</span>
          <span className="close-icon">Close ✕</span>
        </button>

        <div id="dropdownMenu" className="dropdown-menu">
          <div className="menu-section">
            <h4>PROJECTS</h4>
            <a href="#">World</a>
            <a href="#">World App</a>
            <a href="#">Jellybean</a>
            <a href="#">Nolla</a>
            <a href="#">Final Offer</a>
            <a href="#">Oteria</a>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
