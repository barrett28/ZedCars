import React, { useState, useEffect, useRef } from "react";
import "../CSS/Navbar.css";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import home_img from "../../../assets/images/One.png"

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, logout } = useAuth();

  const linksRef = useRef([]); 

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

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

  const animateMenuOpen = () => {
    const gsap = window.gsap;

    gsap.fromTo(
      linksRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        // stagger: 0.1,
        // delay: 0.1,
      }
    );
  };

  const animateMenuClose = () => {
    const gsap = window.gsap;

    gsap.to(linksRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.1,
      ease: "power3.out",
      // stagger: 0.08,
    });
  };

  // Trigger animation when menu opens/closes
  useEffect(() => {
    if (isMenuOpen) animateMenuOpen();
    else animateMenuClose();
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Flowing hover animation refs
const marqueeRefs = useRef([]);
const marqueeInnerRefs = useRef([]);

const animationDefaults = { duration: 0.6, ease: "expo.out" };

const getClosestEdge = (mouseX, mouseY, width, height) => {
  const top = (mouseX - width / 2) ** 2 + (mouseY - 0) ** 2;
  const bottom = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
  return top < bottom ? "top" : "bottom";
};

const handleHoverEnter = (ev, i) => {
  const gsap = window.gsap;
  const rect = ev.currentTarget.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;
  const edge = getClosestEdge(x, y, rect.width, rect.height);

  gsap.timeline({ defaults: animationDefaults })
    .set(marqueeRefs.current[i], { y: edge === "top" ? "-101%" : "101%" })
    .set(marqueeInnerRefs.current[i], { y: edge === "top" ? "101%" : "-101%" })
    .to([marqueeRefs.current[i], marqueeInnerRefs.current[i]], { y: "0%" });
};

const handleHoverLeave = (ev, i) => {
  const gsap = window.gsap;
  const rect = ev.currentTarget.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;
  const edge = getClosestEdge(x, y, rect.width, rect.height);

  gsap.timeline({ defaults: animationDefaults })
    .to(marqueeRefs.current[i], { y: edge === "top" ? "-101%" : "101%" })
    .to(marqueeInnerRefs.current[i], { y: edge === "top" ? "101%" : "-101%" });
};


  return (
    <header className={`navbar ${isVisible ? "visible" : "hidden"}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <a href="/home">ZedCars</a>
        </div>

        <div className="nav-actions">
          {user?.isAuthenticated ? (
            <button
              className=""
              onClick={handleLogout}
              style={{ color: "white", marginRight: "15px" }}
            >
              Logout
            </button>
          ) : (
            <button
              className=""
              onClick={() => navigate("/auth/login")}
              style={{ color: "white", marginRight: "15px" }}
            >
              Login
            </button>
          )}
          <button
            className={`menu-btn ${isMenuOpen ? "open" : ""}`}
            onClick={() => setIsMenuOpen((s) => !s)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <span className="menu-label" style={{ color: "white" }}>
              menu
            </span>
            <span className="menu-plus">
              <span className="plus-h" style={{ color: "white", marginLeft: "2px" }}>
                +
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className={`mobile-nav ${isMenuOpen ? "active" : ""}`}>

        {[
        // -----------------------------
        // PUBLIC (BEFORE LOGIN)
        // -----------------------------
        { text: "Home", href: "/home", image: "https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg", show: true },
        { text: "Inventory", href: "/inventory", image: "https://images.pexels.com/photos/28928971/pexels-photo-28928971.jpeg", show: true },

        // Show About + Contact ONLY before login
        { text: "About", href: "/about", image: "https://images.pexels.com/photos/5941395/pexels-photo-5941395.jpeg", show: !user?.isAuthenticated },
        { text: "Contact", href: "/contact", image: "https://images.pexels.com/photos/215367/pexels-photo-215367.jpeg", show: !user?.isAuthenticated },

        // Login only when NOT logged in
        { text: "Login", href: "/auth/login", image: "https://picsum.photos/600/400?random=5", show: !user?.isAuthenticated },

        // -----------------------------
        // CUSTOMER ITEMS
        // -----------------------------
        { text: "Profile", href: "/profile", image: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg", show: user?.isAuthenticated },
        { text: "My Test Drive", href: "/my-testdrives", image: "https://images.pexels.com/photos/13861/IMG_3496bfree.jpg", show: user?.isAuthenticated && user?.role === "Customer" },
        { text: "My Purchases", href: "/my-purchases", image: "https://images.pexels.com/photos/5926240/pexels-photo-5926240.jpeg", show: user?.isAuthenticated && user?.role === "Customer" },
        { text: "Accessories", href: "/purchaseaccessories", image: "https://images.pexels.com/photos/16030463/pexels-photo-16030463.jpeg", show: user?.isAuthenticated && user?.role === "Customer" },

        // -----------------------------
        // ADMIN/SUPERADMIN ITEMS

        { text: "Manage Users", href: "/admin/users", image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg", show: user?.isAuthenticated && (user?.role === "Admin" || user?.role === "SuperAdmin") },
        { text: "Manage Vehicles", href: "/Admin/AdminInventory", image: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg", show: user?.isAuthenticated && (user?.role === "Admin" || user?.role === "SuperAdmin") },    
        { text: "Accessories", href: "/Admin/ManageAccessories", image: "https://img.freepik.com/free-photo/different-car-accessories-arrangement_23-2149030403.jpg", show: user?.isAuthenticated && (user?.role === "Admin" || user?.role === "SuperAdmin") },
        { text: "View Reports", href: "/Admin/Reports", image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg", show: user?.isAuthenticated && (user?.role === "Admin" || user?.role === "SuperAdmin") },
        { text: "Dashboard", href: "/dashboard2", image: "https://img.freepik.com/free-photo/business-report-graphs-charts-business-reports-pile-documents-business-concept_1150-2254.jpg", show: user?.isAuthenticated && (user?.role === "Admin" || user?.role === "SuperAdmin") },

        // Logout
        { text: "Logout", href: "/home", image: "https://images.pexels.com/photos/1181325/pexels-photo-1181325.jpeg", show: user?.isAuthenticated, logout: true },

      ]
        .filter(item => item.show)
        .map((item, i) => (
          <div
              key={i}
              className="flow-item"
              onMouseEnter={(e) => {
                // Hide original text
                window.gsap.to(linksRef.current[i], { opacity: 0, duration: 0.2 });

                handleHoverEnter(e, i);
              }}
              onMouseLeave={(e) => {
                // Show original text again
                window.gsap.to(linksRef.current[i], { opacity: 1, duration: 0.2 });

                handleHoverLeave(e, i);
              }}
            >

            <a
              href={item.href}
              className="flow-item-link"
              ref={(el) => (linksRef.current[i] = el)}
              onClick={() => {
                setIsMenuOpen(false);

                if (item.logout) {
                  logout();
                  navigate("/auth/login");
                }
              }}
            >
              {item.text}
            </a>

            <div className="flow-marquee" ref={(el) => (marqueeRefs.current[i] = el)}>
              <div className="flow-marquee-inner" ref={(el) => (marqueeInnerRefs.current[i] = el)}>
                {[...Array(8)].map((_, idx) => (
                  <React.Fragment key={idx}>
                    <span>{item.text}</span>
                    <div
                      className="flow-img"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}

      </div>


    </header>
  );
};

export default Navbar;
