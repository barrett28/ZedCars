import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/apiClient';
import '../CSS/VehicleDetail.css';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [testDriveData, setTestDriveData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
    timeSlot: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('URL ID parameter:', id); // Debug log
    if (id) {
      fetchCarDetails();
    } else {
      setError('No vehicle ID provided');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (user.isAuthenticated) {
      setTestDriveData(prev => ({
        ...prev,
        customerName: user.fullName || '',
        customerEmail: user.email || ''
      }));
    }
  }, [user]);

  const fetchCarDetails = async () => {
    try {
      const response = await apiClient.get(`/home/vehicle/${id}`);
      setCar(response.data);
    } catch (err) {
      setError('Failed to load vehicle details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = {
        ...testDriveData,
        carId: parseInt(id)
      };
      
      await apiClient.post('/home/book-testdrive', payload);
      alert('Test drive booked successfully!');
      setShowModal(false);
      setTestDriveData({
        customerName: user.fullName || '',
        customerEmail: user.email || '',
        customerPhone: '',
        bookingDate: '',
        timeSlot: ''
      });
    } catch (err) {
      alert(err.response?.data || 'Failed to book test drive');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setTestDriveData({
      ...testDriveData,
      [e.target.name]: e.target.value
    });
  };

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  if (loading) return <div className="loading">Loading vehicle details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!car) return <div className="error">Vehicle not found</div>;

  return (
    <div className="vehicle-detail-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb-nav">
        <span onClick={() => navigate('/')}>Home</span>
        <span>/</span>
        <span onClick={() => navigate('/inventory')}>Inventory</span>
        <span>/</span>
        <span className="active">{car.brand} {car.model}</span>
      </nav>

      {/* Vehicle Header */}
      <div className="vehicle-header">
        <h1>{car.brand} {car.model}</h1>
        <div className="vehicle-meta">
          <span className="vehicle-id">ID: #{car.carId}</span>
          <span className={`stock-badge ${car.stockQuantity > 0 ? 'available' : 'out-of-stock'}`}>
            {car.stockQuantity > 0 ? 'Available' : 'Out of Stock'}
          </span>
        </div>
      </div>

      <div className="vehicle-content">
        {/* Main Content */}
        <div className="main-content">
          {/* Vehicle Image */}
          <div className="vehicle-gallery">
            <img 
              src={car.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'} 
              alt={`${car.brand} ${car.model}`}
              className="vehicle-image"
            />
          </div>

          {/* Price & Purchase Card */}
          <div className="vehicledetail-price-card">
            <div className="vehicledetail-price-section">
              <div className="vehicledetails-price">${car.price?.toLocaleString()}</div>
              <div className="stock-info">Stock: {car.stockQuantity} available</div>
            </div>
            {user.isAuthenticated && user.role === 'Customer' && (
              <div className="action-section">
                <button className="vehicledetail-purchase-btn" onClick={() => navigate(`/purchase/${car.carId}`)}>
                  Purchase Now
                </button>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="specs-section">
            <h2>Vehicle Specifications</h2>
            <div className="specs-grid">
              <div className="spec-item">
                <div className="spec-label">Brand</div>
                <div className="spec-value">{car.brand}</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Model</div>
                <div className="spec-value">{car.model}</div>
              </div>
              {car.year && (
                <div className="spec-item">
                  <div className="spec-label">Year</div>
                  <div className="spec-value">{car.year}</div>
                </div>
              )}
              {car.variant && (
                <div className="spec-item">
                  <div className="spec-label">Variant</div>
                  <div className="spec-value">{car.variant}</div>
                </div>
              )}
              {car.transmission && (
                <div className="spec-item">
                  <div className="spec-label">Transmission</div>
                  <div className="spec-value">{car.transmission}</div>
                </div>
              )}
              {car.fuelType && (
                <div className="spec-item">
                  <div className="spec-label">Fuel Type</div>
                  <div className="spec-value">{car.fuelType}</div>
                </div>
              )}
              {car.color && (
                <div className="spec-item">
                  <div className="spec-label">Color</div>
                  <div className="spec-value">{car.color}</div>
                </div>
              )}
              {car.mileage && (
                <div className="spec-item">
                  <div className="spec-label">Mileage</div>
                  <div className="spec-value">{car.mileage} MPG</div>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="features-section">
            <h2>Features & Options</h2>
            <div className="features-grid">
              <div className="feature-category">
                <h3>Safety Features</h3>
                <ul>
                  <li>ABS Brakes</li>
                  <li>Airbags</li>
                  <li>Traction Control</li>
                  <li>Rear Parking Sensors</li>
                </ul>
              </div>
              <div className="feature-category">
                <h3>Comfort & Convenience</h3>
                <ul>
                  <li>Automatic Climate Control</li>
                  <li>Leather Seats</li>
                  <li>Heated Steering Wheel</li>
                  <li>Keyless Entry</li>
                </ul>
              </div>
              <div className="feature-category">
                <h3>Technology</h3>
                <ul>
                  <li>Touchscreen Infotainment</li>
                  <li>Apple CarPlay / Android Auto</li>
                  <li>Bluetooth & USB</li>
                  <li>Navigation System</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Action Card */}
          <div className="action-card">
            <h3>Interested in this vehicle?</h3>
            <div className="vehicledetail-action-buttons">
              <button className="vehicledetail-contact-btn ">Contact Us</button>
              {user.isAuthenticated && user.role === 'Customer' && (
                <button 
                  className="vehicledetail-test-drive-btn"
                  onClick={() => setShowModal(true)}
                >
                  Schedule Test Drive
                </button>
              )}
            </div>
          </div>

          {/* Quick Facts */}
          <div className="info-card">
            <h3>Quick Facts</h3>
            <div className="fact-item">
              <span>Stock ID:</span>
              <span>#{car.carId}</span>
            </div>
            <div className="fact-item">
              <span>Availability:</span>
              <span className={car.stockQuantity > 0 ? 'text-success' : 'text-danger'}>
                {car.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="fact-item">
              <span>Quantity:</span>
              <span>{car.stockQuantity} units</span>
            </div>
          </div>

          {/* Description */}
          <div className="info-card">
            <h3>Description</h3>
            <p>
              {car.description || 
                `Experience the ultimate driving machine with this stunning ${car.year} ${car.brand} ${car.model}. Luxury, performance, and technology in one package.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Your Test Drive</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleTestDriveSubmit} className="test-drive-form">
              <div className="form-section">
                <h3>Customer Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={testDriveData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={testDriveData.customerEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={testDriveData.customerPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Date *</label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={testDriveData.bookingDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Select Time Slot *</h3>
                <div className="time-slots">
                  {timeSlots.map((time) => (
                    <label key={time} className="time-slot">
                      <input
                        type="radio"
                        name="timeSlot"
                        value={time}
                        checked={testDriveData.timeSlot === time}
                        onChange={handleInputChange}
                        required
                      />
                      <span>{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Booking...' : 'Book Test Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;
