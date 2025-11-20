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
  {purchases.map((item, index) => {
    const isCar = item.car && item.purchase;
    const isAccessory = item.accessoryPurchaseOnly;

    return (
      <div key={index} className="purchase-card-grid">

        {/* ==== CAR PURCHASE ==== */}
        {isCar && (
          <>
            <div className="card-media">
              <img src={item.car.imageUrl} alt={item.car.model} />
            </div>

            <div className="card-main">
              <h3 className="card-title">{item.car.brand} - {item.car.model}</h3>
              <p className="card-meta">
                {new Date(item.purchase.purchaseDate).toLocaleDateString()}
              </p>

              <div className="card-specs-grid">
                <span>Year: {item.car.year}</span>
                <span>Qty: {item.purchase.purchaseQuantity}</span>
                <span>Mileage: {item.car.mileage} MPG</span>
                <span>Color: {item.car.color}</span>
                <span>Fuel: {item.car.fuelType}</span>
                <span>Transmission: {item.car.transmission}</span>
              </div>

              {item.purchase.selectedAccessoriesString && (
                <div className="card-accessories">
                  <strong>Accessories: </strong>
                  {item.purchase.selectedAccessoriesString}
                </div>
              )}
            </div>

            <div className="card-price">
              ₹{item.purchase.purchasePrice.toLocaleString()}
            </div>

            <div className="card-actions">
              <button
                onClick={() => navigate(`/vehicle/${item.car.carId}`)}
                className="view-details-btn"
              >
                View Details
              </button>
            </div>
          </>
        )}

        {/* ==== ACCESSORY ONLY PURCHASE ==== */}
        {isAccessory && (
          <>
            <div className="card-media accessory-only">
              <span>Accessories</span>
            </div>

            <div className="card-main">
              <h3 className="card-title">Accessories Purchase</h3>
              <p className="card-meta">
                {new Date(item.accessoryPurchaseOnly.purchaseDate).toLocaleDateString()}
              </p>

              <div className="card-specs-grid">
                <span>Buyer: {item.accessoryPurchaseOnly.buyerName}</span>
                <span>Total: ₹{item.accessoryPurchaseOnly.totalPrice.toLocaleString()}</span>
              </div>

              <div className="acc-chips">
                {item.accessoryPurchaseOnly.selectedAccessories?.map((acc, i) => (
                  <span key={i} className="chip">{acc}</span>
                ))}
              </div>
            </div>

            <div className="card-price">
              ₹{item.accessoryPurchaseOnly.totalPrice.toLocaleString()}
            </div>

            <div className="card-actions">
              <button className="view-details-btn">View Details</button>
            </div>
          </>
        )}

      </div>
    );
  })}
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