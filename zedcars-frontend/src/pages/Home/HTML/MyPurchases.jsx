// src/pages/Home/HTML/MyPurchases.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/apiClient';
import '../CSS/MyPurchases.css';

const MyPurchases = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(5);
  const [totalPurchases, setTotalPurchases] = useState(0);

  useEffect(() => {
    console.log('Auth check - isAuthenticated:', user.isAuthenticated, 'role:', user.role);
    if (user.isAuthenticated === null) {
      // Still loading auth state
      return;
    }
    if (user.isAuthenticated && user.role === 'Customer') {
      fetchMyPurchases();
    } else {
      setError('Please login as a customer to view purchases');
      setLoading(false);
    }
  }, [user]);

  const fetchMyPurchases = async (page = 1) => {
    try {
      // const response = await apiClient.get('/home/purchases');
      // setPurchases(response.data);
      const response = await apiClient.get(`/home/purchases?page=${page}&limit=${pageSize}`);
      const data = response.data;
      setPurchases(data.purchases || data.data || data || []);
      setCurrentPage(data.currentPage || page);
      setTotalPages(data.totalPages || 1);
      setTotalPurchases(data.total || data.totalCount || (data.purchases?.length || 0));
      console.log(response.data);
    } catch (err) {
      setError('Failed to load purchases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (e, page) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      setLoading(true);
      fetchMyPurchases(page);
    }
  };

  if (loading) return <div className="loading">Loading your purchases...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-purchases-container">
      <div className="header">
        <h2>My Purchases</h2>
      </div>

      {purchases.length === 0 ? (
        <div className="no-purchases">
          <p>You have not purchased anything yet.</p>
          <button onClick={() => navigate('/inventory')} className="browse-btn">
            Browse Vehicles
          </button>
        </div>
      ) : (
        <div className="purchases-list">
          {purchases.map((item, index) => (
            <div key={index} className="purchase-card">
              {item.car && item.purchase ? (
                // Car Purchase
                <div className="car-purchase">
                  <div className="car-image">
                    <img src={item.car.imageUrl} alt={item.car.model} />
                  </div>
                  <div className="purchase-details">
                    <div className="purchase-header">
                      <h3>{item.car.brand} - {item.car.model}</h3>
                      <span className="price">${item.purchase.purchasePrice.toLocaleString()}</span>
                    </div>
                    
                    <div className="purchase-info">
                      <div className="info-row">
                        <span>Year: {item.car.year}</span>
                        <span>Quantity: {item.purchase.purchaseQuantity}</span>
                      </div>
                      <div className="info-row">
                        <span>Mileage: {item.car.mileage} MPG</span>
                        <span>Color: {item.car.color}</span>
                      </div>
                      <div className="info-row">
                        <span>Fuel: {item.car.fuelType}</span>
                        <span>Transmission: {item.car.transmission}</span>
                      </div>
                      <div className="info-row">
                        <span>Purchase Date: {new Date(item.purchase.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      {item.purchase.selectedAccessoriesString && (
                        <div className="accessories">
                          <strong>Accessories: </strong>
                          {item.purchase.selectedAccessoriesString}
                        </div>
                      )}
                    </div>

                    <div className="purchase-actions">
                      <button 
                        onClick={() => navigate(`/vehicle/${item.car.carId}`)}
                        className="view-details-btn"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ) : item.accessoryPurchaseOnly ? (
                // Accessory Only Purchase
                <div className="accessory-purchase">
                  <div className="accessory-header">
                    <h3>Accessories Purchase</h3>
                    <span className="price">${item.accessoryPurchaseOnly.totalPrice.toLocaleString()}</span>
                  </div>
                  
                  <div className="accessory-info">
                    <div className="info-row">
                      <span>Date: {new Date(item.accessoryPurchaseOnly.purchaseDate).toLocaleDateString()}</span>
                      <span>Buyer: {item.accessoryPurchaseOnly.buyerName}</span>
                    </div>
                    
                    <div className="accessories-list">
                      <strong>Accessories:</strong>
                      {item.accessoryPurchaseOnly.selectedAccessories && item.accessoryPurchaseOnly.selectedAccessories.length > 0 ? (
                        <div className="accessory-tags">
                          {item.accessoryPurchaseOnly.selectedAccessories.map((acc, idx) => (
                            <span key={idx} className="accessory-tag">{acc}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="no-accessories">No accessories selected</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
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
            {Math.min(currentPage * pageSize, totalPurchases)} of {totalPurchases} purchases
          </div>
        </>
      )}

    </div>
  );
};

export default MyPurchases;