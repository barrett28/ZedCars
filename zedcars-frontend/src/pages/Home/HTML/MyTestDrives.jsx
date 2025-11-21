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
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(5);
  const [totalTestDrives, setTotalTestDrives] = useState(0);

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

  const fetchMyTestDrives = async (page = 1) => {
    try {
      const response = await apiClient.get(`/home/testdrives?page=${page}&limit=${pageSize}`);
      const data = response.data;
      setTestDrives(data.testDrives || data.data || data || []);
      setCurrentPage(data.currentPage || page);
      setTotalPages(data.totalPages || Math.ceil((data.testDrives?.length || data.length || 0) / pageSize));
      setTotalTestDrives(data.total || data.totalCount || (data.testDrives?.length || data.length || 0));
    } catch (err) {
      setError('Failed to load test drives');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      setLoading(true);
      fetchMyTestDrives(page);
    }
  };

  if (loading) return <div className="loading">Loading your test drives...</div>;
  if (error) return <div className="error">{error}</div>;

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
          {testDrives.map((testDrive) => (
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
                  <div className="car-image-testdrive">
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

      {/* Pagination */}
      {totalPages > 0 && (
        <>
          <nav className="admin-pagination-nav">
            <ul className="admin-pagination">
              <li className={`admin-page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                <button
                  onClick={(e) => handlePageChange(e, currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  &laquo;
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`admin-page-item ${i + 1 === currentPage ? "active" : ""}`}
                >
                  <button onClick={(e) => handlePageChange(e, i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`admin-page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
                <button
                  onClick={(e) => handlePageChange(e, currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>

          <div className="admin-pagination-info">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalTestDrives)} of {totalTestDrives} test drives
          </div>
        </>
      )}

    </div>
  );
};

export default MyTestDrives;
