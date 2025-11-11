// src/pages/Home/HTML/MyPurchases.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/apiClient';
import '../CSS/MyPurchases.css';
// import '../../Home/CSS/MyPurchases.css';

const MyPurchases = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const fetchMyPurchases = async () => {
    try {
      const response = await apiClient.get('/home/purchases');
      setPurchases(response.data);
      console.log(response.data);
    } catch (err) {
      setError('Failed to load purchases');
      console.error(err);
    } finally {
      setLoading(false);
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
    </div>
  );
};

export default MyPurchases;