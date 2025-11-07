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

        {/* Scroll Content */}
        <div style={{height: '100vh', backgroundColor: '#202020', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h2 style={{color: 'white', fontSize: '3rem'}}>Scroll Content Area</h2>
          <button className='btn'>hello</button>
        </div>
    </div>
  );
};

export default HomeIndex;
