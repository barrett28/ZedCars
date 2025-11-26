import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../../api/apiClient'; // Same as your VehicleDetail
import './DynamicImageSlider.css';

const DynamicImageSlider = ({ carId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch images for a specific car (you can adjust endpoint as needed)
  useEffect(() => {
    const fetchCarImages = async () => {
      try {
        setLoading(true);
        setError('');

        // Adjust this endpoint to match your actual .NET API
        const response = await apiClient.get(`/home/vehicle-images/${carId}`);
        // OR if it's part of vehicle detail: `/home/vehicle/${carId}` and extract images

        // Handle different response shapes
        let imageList = [];

        if (response.data?.images) {
          imageList = response.data.images;
        } else if (Array.isArray(response.data)) {
          imageList = response.data;
        } else if (response.data?.imageUrls) {
          imageList = response.data.imageUrls;
        }

        // Filter valid URLs
        const validImages = imageList.filter(url => url && typeof url === 'string');
        setImages(validImages.length > 0 ? validImages : []);
        
      } catch (err) {
        console.error('Failed to load car images:', err);
        setError('Failed to load images');
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarImages();
    }
  }, [carId]);

  const totalSlides = images.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    if (touchStartX.current - touchEndX.current > 50) nextSlide();
    if (touchEndX.current - touchStartX.current > 50) prevSlide();
  };

  if (loading) {
    return <div className="slider-loading">Loading images...</div>;
  }

  if (error || images.length === 0) {
    return (
      <div className="slider-fallback">
        <img 
          src="https://via.placeholder.com/900x500?text=No+Images+Available" 
          alt="No images"
          style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '12px' }}
        />
      </div>
    );
  }

  return (
    <div className="slider-container">
      <div
        className="slides"
        style={{ 
          transform: `translateX(-${currentIndex * (100 / totalSlides)}%)`,
          width: `${totalSlides * 100}%`
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((imageUrl, index) => (
          <div key={index} className="slide" style={{ width: `${100 / totalSlides}%` }}>
            <img src={imageUrl} alt={`Car view ${index + 1}`} />

            {/* Text panel only on the SECOND image (index === 1) */}
            {index === 1 && (
              <div className={`text-panel ${currentIndex === 1 ? 'active' : ''}`}>
                <h2>Discover the Beauty</h2>
                <p>Experience luxury and performance like never before. This vehicle is designed to impress.</p>
                <button>Explore Now</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arrows - only show if more than 1 image */}
      {totalSlides > 1 && (
        <>
          <div className="arrow left-arrow" onClick={prevSlide}>
            ‹
          </div>
          <div className="arrow right-arrow" onClick={nextSlide}>
            ›
          </div>
        </>
      )}
    </div>
  );
};

export default DynamicImageSlider;