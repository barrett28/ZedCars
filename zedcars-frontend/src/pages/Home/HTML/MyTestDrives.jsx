import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/apiClient';
import '../CSS/MyTestDrives.css';

const MyTestDrives = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (user.isAuthenticated === null) {
      return;
    }
    
    if (user.isAuthenticated && user.role === 'Customer') {
      fetchMyTestDrives();
    } else {
      setError('Please login as a customer to view test drives');
      setLoading(false);
    }
  }, [user]);

  const fetchMyTestDrives = async () => {
    try {
      const response = await apiClient.get('/home/testdrives');
      setTestDrives(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load test drives');
      console.error(err);
      setLoading(false);
    }
  };

  if (user.isAuthenticated === null) {
    return <div className="loading">Loading...</div>;
  }

  if (loading) return <div className="loading">Loading your test drives...</div>;
  if (error) return <div className="error">{error}</div>;

  // Pagination logic
  const totalPages = Math.ceil(testDrives.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTestDrives = testDrives.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="my-testdrives-container">
      <div className="header">
        <h2>My Booked Test Drives</h2>
      </div>

      {testDrives.length === 0 ? (
        <div className="no-testdrives">
          <p>You have not booked any test drives yet.</p>
          <button onClick={() => navigate('/inventory')} className="browse-btn">
            Browse Vehicles
          </button>
        </div>
      ) : (
        <div className="testdrives-list">
          {currentTestDrives.map((testDrive) => (
            <div key={testDrive.testDriveId} className="testdrive-card">
              <div className="testdrive-content">
                <div className="top-section">
                  <div className="basic-info">
                    <h3>{testDrive.customerName}</h3>
                    <p className="phone">{testDrive.customerPhone}</p>
                    <p className="booking-date">
                      <strong>Booking Date:</strong> {new Date(testDrive.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="car-image">
                    <img 
                      src={testDrive.car?.imageUrl} 
                      alt={testDrive.car?.model}
                    />
                  </div>
                </div>
                <div className="testdrive-info">
                  <p className="time-slot">
                    <strong>Time Slot:</strong> {testDrive.timeSlot}
                  </p>
                  
                  <div className="car-details">
                    <div className="car-spec">
                      <strong>Brand:</strong> {testDrive.car?.brand}
                    </div>
                    <div className="car-spec">
                      <strong>Model:</strong> {testDrive.car?.model}
                    </div>
                    <div className="car-spec">
                      <strong>Transmission:</strong> {testDrive.car?.transmission}
                    </div>
                    <div className="car-spec">
                      <strong>Variant:</strong> {testDrive.car?.variant}
                    </div>
                  </div>

                  <div className="status-price">
                    <span className={`status-badge ${testDrive.status?.toLowerCase()}`}>
                      {testDrive.status}
                    </span>
                    <span className="price">${testDrive.car?.price?.toLocaleString()}</span>
                  </div>

                  <button 
                    onClick={() => navigate(`/vehicle/${testDrive.car?.carId}`)}
                    className="view-details-btn"
                  >
                    View Car Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {testDrives.length > 0 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages} ({testDrives.length} items)</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyTestDrives;
