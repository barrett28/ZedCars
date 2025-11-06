import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';
import '../CSS/index.css';
import carVideo from '../../../assets/video/car_video.mp4';
import heroVideo from '../../../assets/video/hero-video.mp4';
// import car1 from "../../../assets/images/";

const HomeIndex = () => {
  const [homeData, setHomeData] = useState({
    vehicleCount: 0,
    featuredCars: []
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchHomeData();
    // initializeAnimations();
    initializeAccordion();
    initializeMouseTrail();
    initializeGSAP();
    initializeGSAP1();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await apiClient.get('home/index');
      setHomeData(response.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  };

  const initializeGSAP = () => {
  gsap.registerPlugin(ScrollTrigger);
  
  // Hero animations
  gsap.to(".hero h1", { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
  gsap.to(".hero h2", { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" });

  // Scroll timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=1200",
      scrub: true,
      pin: true,
    },
  });

  tl.to(".hero h1", { x: "-100vw", ease: "power1.out" }, 0)
    .to(".hero h2", { x: "100vw", ease: "power1.out" }, 0)
    .to(".info-box", { bottom: "100%", ease: "power1.out" }, 0);
};

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

  const initializeGSAP1 = () => {
    // Use global GSAP from CDN
    if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
      console.error('GSAP or ScrollTrigger not loaded');
      return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    // Initial fade-in
    gsap.to(".hero h1", { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    gsap.to(".hero h2", { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" });

    // Scroll Animation (synced)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=1200",
        scrub: true,
        pin: true,
      },
    });

    tl.to(".hero h1", { x: "-100vw", ease: "power1.out" }, 0)
      .to(".hero h2", { x: "100vw", ease: "power1.out" }, 0)
      .to(".info-box", { bottom: "100%", ease: "power1.out" }, 0);

    // Text cards scroll animation
    const t2 = gsap.timeline({
      scrollTrigger: {
        trigger: "#main",
        start: "38% 50%",
        end: "100% 50%",
        scrub: 2,
        pin: true
      }
    });

    t2.to(".text", { top: "-7%" }, 'a')
      .to("#card-one", { top: "35%" }, 'a')
      .to("#card-two", { top: "130%" }, 'a')
      .to("#card-two", { top: "42%" }, 'b')
      .to("#card-one", { width: "65%", height: "65vh" }, 'b')
      .to("#card-three", { top: "130%" }, 'b')
      .to("#card-three", { top: "50%" }, 'c')
      .to("#card-two", { width: "70%", height: "70vh" }, 'c');
  };

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

    const container = document.querySelector('.hover-container');
    const headingElement = document.querySelector('.heading');
    let currentImageIndex = 0;
    let lastX = 0;
    let lastY = 0;
    const distanceThreshold = 120;

    const createTrail = (x, y) => {
      const img = document.createElement('img');
      img.classList.add('hover-images');
      img.src = images[currentImageIndex];
      img.style.position = 'absolute';
      img.style.pointerEvents = 'none';
      img.style.width = '100px';
      img.style.height = '60px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '8px';
      img.style.left = x + 'px';
      img.style.top = y + 'px';
      img.style.transform = 'scale(0)';
      img.style.opacity = '0';
      img.style.transition = 'all 0.4s ease';
      
      container.appendChild(img);
      currentImageIndex = (currentImageIndex + 1) % images.length;

      setTimeout(() => {
        img.style.transform = 'scale(1)';
        img.style.opacity = '1';
      }, 10);

      setTimeout(() => {
        img.style.transform = 'scale(0.2)';
        img.style.opacity = '0';
        setTimeout(() => img.remove(), 400);
      }, 700);
    };

    if (container && headingElement) {
      window.addEventListener('mousemove', (e) => {
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

  const slides = [
    { text: "Zed Cars", image: "/images/sideviewLam.png" },
    { text: "The Cars You Want", image: "/images/topviewLam-removebg-preview.png" },
    { text: "Excellence in Every Ride", image: "/images/frontviewLam-removebg-preview.png" },
    { text: "Dreams We Deliver", image: "/images/backviewLam-removebg-preview.png" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div>
      
      <div className="hero">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source src={carVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
        <h1>Discover Your Dream</h1>
        <h2>Ride Only at ZedCars</h2>

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

      {/* Cards scroll section */}
      <div id="main">
        <div className="text">
          <div className="text-img"></div>
          <h1>ZedCars: Precision Engineering<br /> with finest cars</h1>
          <p>
            Explore the future of automotive design and performance. ZedCars represents the ultimate fusion of power and artistic quality.
          </p>
        </div>
        <div className="cards" id="card-one"></div>
        <div className="cards" id="card-two"></div>
        <div className="cards" id="card-three"></div>
      </div>

      {/* Car Slider */}
      <div className="landing">
        <div className="left">
          <div className="slider-controls">
            <button className="slider-btn prev" onClick={prevSlide}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <button className="slider-btn next" onClick={nextSlide}>
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="right">
          <div className="image-slider">
            {slides.map((slide, index) => (
              <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`}>
                <div className="slider-text">
                  {slide.text}
                  <img src={slide.image} className="slider-image" alt="Car view" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="hero-section">
          <h1>Welcome to ZedCars</h1>
          <p className="lead">Discover our premium collection of vehicles and automotive accessories</p>
          <div className="hero-buttons">
            <a href="/inventory" className="btn btn-primary">Browse Inventory</a>
            <a href="/contact" className="btn btn-light">Contact Us</a>
            <a href="/accessories" className="btn btn-light">Purchase Accessory</a>
          </div>
        </div>

        <div className="inventory-section mt-4">
          <h2>Our Vehicle Inventory</h2>
          <p>Browse our carefully selected collection of quality vehicles from trusted manufacturers.</p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{homeData.vehicleCount}</h3>
              <p>Vehicles Available</p>
            </div>
            <div className="stat-card">
              <h3>8</h3>
              <p>Premium Brands</p>
            </div>
            <div className="stat-card">
              <h3>100%</h3>
              <p>Quality Guaranteed</p>
            </div>
          </div>

          <div className="brands-section">
            <h3>Featured Brands</h3>
            <div className="brands-slider">
              <div className="brands-track">
                <div className="brand-item">
                  <img src="https://www.freepnglogos.com/uploads/toyota-logo-png/toyota-logos-brands-logotypes-0.png" alt="Toyota" />
                </div>
                <div className="brand-item">
                  <img src="https://www.freepnglogos.com/uploads/honda-logo-png/honda-logo-png-mahesh-deviantart-3.png" alt="Honda" />
                </div>
                <div className="brand-item">
                  <img src="https://www.freepnglogos.com/uploads/ford-cars-logo-brands-png-images-15.png" alt="Ford" />
                </div>
                <div className="brand-item">
                  <img src="https://www.freepnglogos.com/uploads/bmw-logo-14.png" alt="BMW" />
                </div>
                <div className="brand-item">
                  <img src="https://www.freepnglogos.com/uploads/mercedes-logo-png/mercedes-logo-outsource-custom-modeling-service-and-rendering-services-24.png" alt="Mercedes" />
                </div>
                <div className="brand-item">
                  <img src="https://www.freepnglogos.com/uploads/audi-logo-3.png" alt="Audi" />
                </div>
                <div className="brand-item">
                  <img src="https://www.freepnglogos.com/uploads/tesla-logo-png-33.png" alt="Tesla" />
                </div>
              </div>
            </div>
          </div>

          <div className="featured-vehicles">
            <h3>Featured Vehicles</h3>
            <div className="vehicle-grid">
              {homeData.featuredCars && homeData.featuredCars.length > 0 ? (
                homeData.featuredCars.map((car) => (
                  <div key={car.carId} className="vehicle-card">
                    <div className="vehicle-image">
                      <img 
                        src={car.imageUrl || "/images/placeholder-car.png"} 
                        alt={`${car.brand} ${car.model}`} 
                      />
                    </div>
                    <div className="vehicle-details bg-dark bg-opacity-75">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className="text-white">{car.brand} {car.model}</h4>
                        <p className="vehicle-desc text-light font-monospace">
                          {car.fuelType || "No Fueltype"}
                        </p>
                      </div>
                      <p className="vehicle-price text-light">$ {car.price}</p>
                      <p className="vehicle-desc text-light">
                        {car.description || "No description"}
                      </p>
                      <a href={`/vehicle/${car.carId}`} className="btn btn-sm btn-primary">
                        View Details
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p>No featured vehicles available at the moment.</p>
              )}
            </div>
            <div className="view-all-link">
              <a href="/inventory" className="btn">View All Vehicles</a>
            </div>
          </div>

          <div className="cta-section mt-5">
            <div className="cta-content">
              <h3><i className="bi bi-car-front"></i> Ready to Drive Your Dream Car?</h3>
              <p>Contact our expert team today and explore vehicles that perfectly match your lifestyle.</p>
              <div className="cta-buttons">
                <a href="/contact" className="btn btn-primary btn-lg">Contact Us</a>
                <a href="/about" className="btn btn-outline-light btn-lg">Learn More</a>
              </div>
            </div>
          </div>
        </div>

        <div className="why-choose-us">
          <h3>Why Choose ZedCars?</h3>
          <div className="why-grid">
            <div className="why-card">
              <i className="bi bi-shield-check"></i>
              <h4>Trusted Quality</h4>
              <p>All vehicles go through a 150-point inspection for guaranteed quality.</p>
            </div>
            <div className="why-card">
              <i className="bi bi-cash-coin"></i>
              <h4>Best Prices</h4>
              <p>Competitive pricing with transparent deals, no hidden costs.</p>
            </div>
            <div className="why-card">
              <i className="bi bi-truck"></i>
              <h4>Free Delivery</h4>
              <p>Enjoy free doorstep delivery within city limits.</p>
            </div>
            <div className="why-card">
              <i className="bi bi-search"></i>
              <h4>Intelligent filtering</h4>
              <p>Search and filtration of vehicles by multiple factors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default HomeIndex;
