import React, { useEffect } from 'react';
import '../CSS/index.css';
// import "../../../"
import carVideo from "../../../assets/video/car_video.mp4"
import heroVideo from "../../../assets/video/hero-video.mp4"

const HomeIndex = () => {

  useEffect(() => {
    // Add delay to ensure GSAP is loaded
    const timer = setTimeout(() => {
      initializeGSAP();
      initializeAccordion();
      initializeMouseTrail();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Initialize GSAP animations
  const initializeGSAP = () => {
    if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
      console.error('GSAP or ScrollTrigger not loaded');
      return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    // Hero section initial fade-in animations
    gsap.to(".hero h1", { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    gsap.to(".hero h2", { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" });

    // Hero section scroll animation (synced)
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=1200",
        scrub: true,
        pin: true,
      },
    });

    heroTimeline
      .to(".hero h1", { x: "-100vw", ease: "power1.out" }, 0)
      .to(".hero h2", { x: "100vw", ease: "power1.out" }, 0)
      .to(".info-box", { bottom: "50%", ease: "power1.out" }, 0)
      .to(".video-overlay", {backgroundColor: "black"}, 0);
  };

  // Initialize accordion functionality
  const initializeAccordion = () => {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        document.querySelectorAll('.accordion-item').forEach(i => {
          if (i !== item) i.classList.remove('active');
        });
        item.classList.toggle('active');
      });
    });
  };

  // Initialize mouse trail
  const initializeMouseTrail = () => {
    const images = [
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
      "https://images.unsplash.com/photo-1638571860775-92317a71208f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
      "https://images.unsplash.com/photo-1562716190-5c19488ea1fe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171",
      "https://images.unsplash.com/photo-1641430589592-71899ccfb388?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
      "https://images.unsplash.com/photo-1591567783286-b4ab19455406?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
      "https://images.unsplash.com/photo-1669676346565-8a7084212256?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
      "https://images.unsplash.com/photo-1560244813-02a89fe3930f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1245",
    ];

    const container = document.querySelector(".hover-container");
    const headingElement = document.querySelector(".heading");

    let currentImageIndex = 0;
    let lastX = 0;
    let lastY = 0;
    let distanceThreshold = 120;

    function createTrail(x, y) {
      const img = document.createElement("img");
      img.classList.add("hover-images");
      img.src = images[currentImageIndex];
      container.appendChild(img);

      currentImageIndex = (currentImageIndex + 1) % images.length;

      if (window.gsap) {
        const { gsap } = window;
        gsap.set(img, {
          x: x,
          y: y,
          scale: 0,
          opacity: 0,
        });
        gsap.to(img, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(img, {
          scale: 0.2,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: "power2.in",
          onComplete: () => {
            img.remove();
          }
        });
      }
    }

    if (container && headingElement) {
      window.addEventListener("mousemove", (e) => {
        const containerRect = container.getBoundingClientRect();
        const headingRect = headingElement.getBoundingClientRect();

        const isOverContainer = (e.clientX >= containerRect.left && e.clientX <= containerRect.right &&
          e.clientY >= containerRect.top && e.clientY <= containerRect.bottom);

        const isBelowHeading = e.clientY > headingRect.bottom;

        if (isOverContainer && isBelowHeading) {
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > distanceThreshold) {
            createTrail(e.clientX, e.clientY);
            lastX = e.clientX;
            lastY = e.clientY;
          }
        }
      });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero">
          {/* Background Video */}
          <video className="bg-video" autoPlay muted loop playsInline>
            <source src={carVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <div className="video-overlay"></div>

          {/* Headings */}
          <h1>Discover Your Dream</h1>
          <h2>Ride Only at ZedCars</h2>

          {/* Info Box */}
          <div className="info-box">
            <div className="info-video">
              <video autoPlay muted loop playsInline>
                <source src={heroVideo} type="video/mp4" />
              </video>
            </div>

            <div className="info-text">
              ZedCars brings you a curated collection of luxury and performance vehicles.
              Explore, compare, and drive your dream today — elegance meets power.
            </div>

            {/* Accordion */}
            <div className="accordion">
              <div className="accordion-item">
                <button className="accordion-header">Performance Cars</button>
                <div className="accordion-content">
                  <p>Unleash precision engineering and thrilling performance on every road.</p>
                </div>
              </div>

              <div className="accordion-item">
                <button className="accordion-header">Luxury Cars</button>
                <div className="accordion-content">
                  <p>Experience elegance and craftsmanship crafted to perfection.</p>
                </div>
              </div>

              <div className="accordion-item">
                <button className="accordion-header">SUVs & Family</button>
                <div className="accordion-content">
                  <p>Space, power, and comfort — designed for every adventure.</p>
                </div>
              </div>

              <div className="accordion-item">
                <button className="accordion-header">Electric Cars</button>
                <div className="accordion-content">
                  <p>Step into the future with advanced electric technology and innovation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Container */}
        <div className="hover-container">
          <div className="heading">
            <h2><span style={{color:'#FFC43A'}}>Command</span> Attention</h2>
            <h2>with <br /> the <span style={{color:'#FFC43A'}}>ZedCars</span></h2>
          </div>
        </div>

        {/* Scroll Content */}
        <div style={{height: '100vh', backgroundColor: '#202020', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h2 style={{color: 'white', fontSize: '3rem'}}>Scroll Content Area</h2>
          <button className='btn'>hello</button>
        </div>
    </div>
  );
};

export default HomeIndex;
