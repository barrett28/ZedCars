import React, { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient";
import "../CSS/AdminInventory.css";
import { useNavigate } from "react-router-dom";

const AdminInventory = () => {
  const [data, setData] = useState({
    cars: [],
    brands: [],
    selectedBrand: "",
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCars: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    cars,
    brands,
    selectedBrand,
    currentPage,
    totalPages,
    pageSize,
    totalCars,
  } = data;

  // Fetch inventory data
  const fetchInventoryData = async (page = 1, filters = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        brand: filters.brand || "",
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await apiClient.get(`/admin/inventory?${params}`);

      setData({
        cars: response.data.cars || [],
        brands: response.data.brands || [],
        selectedBrand: response.data.selectedBrand || "",
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        pageSize: response.data.pageSize || 10,
        totalCars: response.data.totalCars || 0,
      });
    } catch (error) {
      console.error("❌ Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Brand Filter Change
  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    const filters = { brand: newBrand };
    fetchInventoryData(1, filters);
  };

  // ✅ Handle page change
  const handlePageChange = (e, page) => {
    e.preventDefault();
    const filters = { brand: selectedBrand };
    fetchInventoryData(page, filters);
  };

  // ✅ Delete Vehicle
  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await apiClient.delete(`/admin/vehicles/${carId}`);
      fetchInventoryData(currentPage, { brand: selectedBrand });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle");
    }
  };

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="page-header">
        <h1>Vehicle Inventory Management</h1>
        <p>Manage your vehicle inventory</p>
      </div>

      {/* Brand Filter + Add Vehicle */}
      <div className="filter-form">
        <div className="filter-grid">
          <select
            className="form-select"
            value={selectedBrand}
            onChange={handleBrandChange}
          >
            <option value="">All Brands</option>
            {brands.map((brand, index) => (
              <option key={index} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate("/Admin/AddVehicle")}
            className="btn btn-success"
          >
            Add New Vehicle
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      {cars.length > 0 ? (
        <div className="inventory-table">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Year</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.carId || car.id}>
                  <td>
                    <img
                      src={
                        car.imageUrl ||
                        "https://via.placeholder.com/80x60?text=No+Image"
                      }
                      alt={`${car.make} ${car.model}`}
                      className="vehicle-thumbnail"
                    />
                  </td>
                  <td>{car.make}</td>
                  <td>{car.model}</td>
                  <td>{car.year}</td>
                  <td>${car.price?.toLocaleString()}</td>
                  <td>
                    <span
                      className={`stock-badge ${
                        car.stockQuantity > 0 ? "in-stock" : "out-of-stock"
                      }`}
                    >
                      {car.stockQuantity}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() =>
                          navigate(`/Admin/EditVehicle/${car.carId || car.id}`)
                        }
                        className="btn btn-primary btn-sm"
                      >
                        Edit
                        </button>

                      <button
                        onClick={() => handleDelete(car.carId || car.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-vehicles">
          <h3>No vehicles available</h3>
          <p>Please add some vehicles to your inventory.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <>
          <nav className="pagination-nav">
            <ul className="pagination">
              <li
                className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}
              >
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
                  className={`page-item ${
                    i + 1 === currentPage ? "active" : ""
                  }`}
                >
                  <button onClick={(e) => handlePageChange(e, i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage >= totalPages ? "disabled" : ""
                }`}
              >
                <button
                  onClick={(e) => handlePageChange(e, currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>

          <div className="pagination-info">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalCars)} of {totalCars} vehicles
          </div>
        </>
      )}
    </div>
  );
};

export default AdminInventory;
