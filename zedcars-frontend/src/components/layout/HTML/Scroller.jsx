import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import '../CSS/Scroller.css'

const Scroller = ({ slides, speed = 20 }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !slides?.length) return;

    const track = wrapper.querySelector('.infinite-track');
    const cards = wrapper.querySelectorAll('.infinite-card');
    
    // Duplicate the content for seamless loop
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    const totalWidth = track.scrollWidth / 2;

    const animation = gsap.to(track, {
      x: -totalWidth,
      duration: speed,
      ease: "none",
      repeat: -1,
    });

    return () => animation.kill();
  }, [slides, speed]);

  return (
    <div className="infinite-wrapper" ref={wrapperRef}>
      <div className="infinite-track">
        {slides.map((slide, i) => (
          <div className="infinite-card" key={i}>
            <img src={slide.image} alt={slide.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scroller;