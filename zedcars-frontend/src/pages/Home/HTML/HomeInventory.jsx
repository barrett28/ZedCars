import React, { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient";
import { getFirstImageUrl } from "../../../utils/imageUtils";
import "../../Home/CSS/HomeInventory.css";
import { useNavigate } from "react-router-dom";

const HomeInventory = () => {
  const [data, setData] = useState({
    cars: [],
    brands: [],
    fuelTypes: [],
    selectedBrand: "",
    selectedPriceRange: "",
    selectedFuelType: "",
    currentPage: 1,
    totalPages: 1,
    pageSize: 6,
    totalCars: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    cars,
    brands,
    fuelTypes,
    selectedBrand,
    selectedPriceRange,
    selectedFuelType,
    currentPage,
    totalPages,
    pageSize,
    totalCars,
  } = data;

  // ✅ Fetch inventory data
  const fetchInventoryData = async (page = 1, filters = {}) => {
    try {
      setLoading(true);

      // Construct query params matching backend parameter names exactly
      const params = new URLSearchParams({
        brand: filters.brand || "",
        priceRange: filters.priceRange || "",
        fuelType: filters.fuelType || "",
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await apiClient.get(`/home/inventory?${params}`);

      // ✅ Normalize response keys (match React casing)
      setData({
        cars: response.data.cars || [],
        brands: response.data.brands || [],
        fuelTypes: response.data.fuelTypes || [],
        selectedBrand: response.data.selectedBrand || "",
        selectedPriceRange: response.data.selectedPriceRange || "",
        selectedFuelType: response.data.selectedFuelType || "",
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        pageSize: response.data.pageSize || 6,
        totalCars: response.data.totalCars || 0,
      });
    } catch (error) {
      console.error("❌ Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchInventoryData();
  }, []);

  // ✅ Filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const filters = {
      brand: formData.get("brand") || "",
      priceRange: formData.get("priceRange") || "",
      fuelType: formData.get("fuelType") || "",
    };
    fetchInventoryData(1, filters);
  };

  // ✅ Handle page change (preserve current filters)
  const handlePageChange = (page) => {
    const filters = {
      brand: selectedBrand,
      priceRange: selectedPriceRange,
      fuelType: selectedFuelType,
    };
    fetchInventoryData(page, filters);
  };

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="page-header">
        <h1>Vehicle Inventory</h1>
        <p>Browse our selection of quality vehicles</p>
      </div>

      {/* Filter Form */}
      <form className="filter-form" onSubmit={handleFilterSubmit}>
        <div className="filter-grid">
          <select
            name="brand"
            className="form-select"
            defaultValue={selectedBrand}
          >
            <option value="">All Brands</option>
            {brands.map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            name="priceRange"
            className="form-select"
            defaultValue={selectedPriceRange}
          >
            <option value="">All Prices</option>
            <option value="0-20000">$0 - $20,000</option>
            <option value="20001-30000">$20,001 - $30,000</option>
            <option value="30001-40000">$30,001 - $40,000</option>
            <option value="40001-50000">$40,001 - $50,000</option>
            <option value="50001-60000">$50,001 - $60,000</option>
          </select>

          <select
            name="fuelType"
            className="form-select"
            defaultValue={selectedFuelType}
          >
            <option value="">All Fuel Types</option>
            {fuelTypes.map((f, i) => (
              <option key={i} value={f}>
                {f}
              </option>
            ))}
          </select>

          <button type="submit" className="btn btn-primary">
            Filter
          </button>
        </div>
      </form>

      {/* Vehicle Grid */}
      <div className="inventory-grid">
        {cars.length > 0 ? (
          cars.map((car) => (
            <div
              className="vehicle-card"
              key={car.id}
              onClick={() => navigate(`/vehicle/${car.carId || car.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="vehicle-image">
                <img
                  // src={car.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                  src={
                    getFirstImageUrl(car.imageUrl) ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={`${car.make} ${car.model}`}
                />
                {car.stockQuantity <= 0 && (
                  <div className="out-of-stock-overlay">Out of Stock</div>
                )}
              </div>
              <div className="vehicle-info">
                <h3>
                  {car.make} {car.model}
                </h3>
                {car.year && <p className="vehicle-year">{car.year}</p>}

                <div className="vehicle-details">
                  {car.fuelType && (
                    <span className="detail-item">{car.fuelType}</span>
                  )}
                  {car.transmission && (
                    <span className="detail-item">{car.transmission}</span>
                  )}
                  {car.mileage && (
                    <span className="detail-item">
                      {car.mileage.toLocaleString()} miles
                    </span>
                  )}
                </div>

                <div className="vehicle-price">
                  <span className="inventory-price">
                    ${car.price?.toLocaleString()}
                  </span>
                  <span className="stock">Stock: {car.stockQuantity}</span>
                </div>

                <div className="vehicle-actions">
                  <button
                    onClick={() => navigate(`/vehicle/${car.carId || car.id}`)}
                    className="btn btn-primary"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-vehicles">
            <h3>No vehicles available</h3>
            <p>Please check back later for new inventory.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <>
          <nav className="pagination-nav">
            <ul className="pagination">
              <li
                key="prev"
                className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  &laquo;
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={`page-${i + 1}`}
                  className={`page-item ${
                    i + 1 === currentPage ? "active" : ""
                  }`}
                >
                  <button onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                key="next"
                className={`page-item ${
                  currentPage >= totalPages ? "disabled" : ""
                }`}
              >
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>

          <div className="pagination-info">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalCars)} of {totalCars}{" "}
            vehicles
          </div>
        </>
      )}
    </div>
  );
};

export default HomeInventory;
