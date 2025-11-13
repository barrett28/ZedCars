import React, { useEffect } from 'react';
import '../CSS/index.css';
import carVideo from "../../../assets/video/car_video.mp4"
import heroVideo from "../../../assets/video/hero-video.mp4"
import { color } from 'chart.js/helpers';

const HomeIndex = () => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeGSAP();
      initializeAccordion();
      initializeSlider();
      initializeMouseTrail();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, []);

  const initializeGSAP = () => {
    if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
      console.error('GSAP or ScrollTrigger not loaded');
      return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".hero h1", { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    gsap.to(".hero h2", { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" });

    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=1200",
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          if (self.progress === 0) {
            gsap.set(".hero h1", { x: 0, y: 0, opacity: 1 });
            gsap.set(".hero h2", { x: 0, y: 0, opacity: 1 });
            gsap.set(".info-box", { bottom: "-183%" });
          }
        }
      },
    });

    heroTimeline
      .to(".hero h1", { x: "-100vw", ease: "power1.out" }, 0)
      .to(".hero h2", { x: "100vw", ease: "power1.out" }, 0)
      .to(".info-box", { bottom: "100%", ease: "power1.out" }, 0);

    const cardsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#main",
        start: "38% 50%",
        end: "100% 50%",
        scrub: 2,
        pin: true
      }
    });

    cardsTimeline
      .to(".text", { top: "-7%" }, 'a')
      .to("#card-one", { top: "35%" }, 'a')
      .to("#card-two", { top: "130%" }, 'a')
      .to("#card-two", { top: "42%" }, 'b')
      .to("#card-one", { width: "65%", height: "65vh" }, 'b')
      .to("#card-three", { top: "130%" }, 'b')
      .to("#card-three", { top: "50%" }, 'c')
      .to("#card-two", { width: "70%", height: "70vh" }, 'c');

    ScrollTrigger.refresh();
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

  const initializeSlider = () => {
    const slides = Array.from(document.querySelectorAll(".slide"));
    const prevBtn = document.querySelector(".slider-btn.prev");
    const nextBtn = document.querySelector(".slider-btn.next");
    let currentIndex = 0;
    let isAnimating = false;
    const DURATION = 700;

    function showSlide(newIndex, direction) {
      if (isAnimating || newIndex === currentIndex) return;
      isAnimating = true;

      const currentSlide = slides[currentIndex];
      const nextSlide = slides[newIndex];
      const currentImage = currentSlide.querySelector(".slider-image");
      const nextImage = nextSlide.querySelector(".slider-image");
      const currentText = currentSlide.querySelector(".slider-text");
      const nextText = nextSlide.querySelector(".slider-text");

      nextSlide.classList.add("active");
      nextImage.style.transition = "none";
      nextImage.style.transform = direction === "next" ? "translateX(100%)" : "translateX(-100%)";
      nextImage.style.opacity = "0";
      nextText.style.opacity = "0";
      nextText.style.transition = "none";
      void nextSlide.getBoundingClientRect();

      currentImage.style.transition = `transform ${DURATION}ms ease, opacity ${DURATION}ms ease`;
      nextImage.style.transition = `transform ${DURATION}ms ease, opacity ${DURATION}ms ease`;

      currentImage.style.transform = direction === "next" ? "translateX(-100%)" : "translateX(100%)";
      currentImage.style.opacity = "0";
      nextImage.style.transform = "translateX(0)";
      nextImage.style.opacity = "1";

      currentText.style.opacity = "0";
      setTimeout(() => {
        nextText.style.transition = "opacity 0.7s ease";
        nextText.style.opacity = "1";
      }, DURATION / 2);

      setTimeout(() => {
        currentSlide.classList.remove("active");
        currentImage.classList.remove("active");
        nextImage.classList.add("active");
        isAnimating = false;
        currentIndex = newIndex;
      }, DURATION + 50);
    }

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener("click", () => {
        const newIndex = (currentIndex + 1) % slides.length;
        showSlide(newIndex, "next");
      });

      prevBtn.addEventListener("click", () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(newIndex, "prev");
      });
    }
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

    let currentImageIndex = 0;
    let lastX = 0;
    let lastY = 0;

    window.addEventListener("mousemove", (e) => {
      const container = document.querySelector(".hover-container");
      if (!container || !window.gsap) return;

      const containerRect = container.getBoundingClientRect();
      
      if (e.clientX >= containerRect.left && 
          e.clientX <= containerRect.right &&
          e.clientY >= containerRect.top && 
          e.clientY <= containerRect.bottom) {
        
        const distance = Math.sqrt((e.clientX - lastX) ** 2 + (e.clientY - lastY) ** 2);
        
        if (distance > 120) {
          const img = document.createElement("img");
          img.src = images[currentImageIndex];
          img.style.cssText = `
            position: absolute;
            left: ${e.clientX - containerRect.left}px;
            top: ${e.clientY - containerRect.top}px;
            width: 200px;
            height: 150px;
            border-radius: 10px;
            object-fit: cover;
            pointer-events: none;
            z-index: 0;
          `;
          container.appendChild(img);

          currentImageIndex = (currentImageIndex + 1) % images.length;

          window.gsap.fromTo(img, 
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
          );
          window.gsap.to(img, {
            scale: 0.2,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: "power2.in",
            onComplete: () => img.remove()
          });

          lastX = e.clientX;
          lastY = e.clientY;
        }
      }
    });
  };

  return (
    <div className="home-page">
      <div className="hero">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source src={carVideo} type="video/mp4" />
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

      <div className="hover-container">
        <div className="heading">
          <h2><span style={{color:'#FFC43A'}}>Command</span> Attention</h2>
          <h2>with <br /> the <span style={{color:'#FFC43A'}}>ZedCars</span> <button className='btn btn-primary'>Browse Inventory</button></h2>
        </div>
      </div>

      <div id="main">
        <div className="text">
          <div className="text-img"></div>
          <h1><span style={{color:'#FFC43A'}}>ZedCars</span> - Precision Engineering<br /> with finest cars</h1>
          <p>
            Explore the future of automotive design and performance. ZedCars represents the ultimate fusion of power and artistic quality.
          </p>
        </div>
        <div className="cards" id="card-one"></div>
        <div className="cards" id="card-two"></div>
        <div className="cards" id="card-three"></div>
      </div>

      <div className="landing">
        <div className="left">
          <div className="slider-controls">
            <button className="slider-btn prev" title="Previous">
              <i className="bi bi-arrow-left"></i>
            </button>
            <button className="slider-btn next" title="Next">
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
        <div className="right">
          <div className="image-slider">
            <div className="slide active">
              <div className="slider-text active">
                Zed<span>Cars</span>
                <img src="/images/sideviewLam.png" className="slider-image active" alt="Car side view" />
              </div>
            </div>
            <div className="slide">
              <div className="slider-text">The Cars You Want
                <img src="/images/topviewLam-removebg-preview.png" className="slider-image" alt="Car top view" />
              </div>
            </div>
            <div className="slide">
              <div className="slider-text">Excellence in Every Ride
                <img src="/images/frontviewLam-removebg-preview.png" className="slider-image" alt="Car front view" />
              </div>
            </div>
            <div className="slide">
              <div className="slider-text">Dreams We Deliver
                <img src="/images/backviewLam-removebg-preview.png" className="slider-image" alt="Car back view" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeIndex;
