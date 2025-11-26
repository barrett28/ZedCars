import React, { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient";
import { getFirstImageUrl } from "../../../utils/imageUtils";
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
  const [showModal, setShowModal] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

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

  // Pagination
  const handlePageChange = (e, page) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages) {
      fetchInventoryData(page, { brand: selectedBrand });
    }
  };
 const openDeleteModal = (carId) => {
    setSelectedCarId(carId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCarId(null);
  };

  const confirmDelete = async () => {
    if (!selectedCarId) return;
    setLoading(true);
    try {
      await apiClient.delete(`/admin/vehicles/${selectedCarId}`);
      closeModal();
      fetchInventoryData(currentPage, { brand: selectedBrand });
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading inventory...</div>;
  }

  return (
    <div className="admin-inventory-page">
      {/* Header
      <div className="admin-page-header">
        <h1>Vehicle Inventory Management</h1>
        <p>Manage your vehicle inventory</p>
      </div> */}

      {/* Brand Filter + Add Vehicle */}
      <div className="admin-filter-form">
        <div className="admin-filter-grid">
          <h1>Manage Vehicles</h1>
          <select
            className="admin-form-select"
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
            className="admin-btn admin-btn-success"
          >
            Add New Vehicle
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      {cars.length > 0 ? (
        <div className="admin-inventory-table">
          <table className="admin-table">
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
                        getFirstImageUrl(car.imageUrl) ||
                        "https://via.placeholder.com/80x60?text=No+Image"
                      }
                      alt={`${car.make} ${car.model}`}
                      className="admin-vehicle-thumbnail"
                    />
                  </td>
                  <td>{car.make}</td>
                  <td>{car.model}</td>
                  <td>{car.year}</td>
                  <td>${car.price?.toLocaleString()}</td>
                  <td>
                    <span
                      className={`admin-stock-badge ${
                        car.stockQuantity > 0 ? "in-stock" : "out-of-stock"
                      }`}
                    >
                      {car.stockQuantity}
                    </span>
                  </td>
                  <td>
                    <div className="admin-action-buttons">
                      <button
                        onClick={() =>
                          navigate(`/Admin/EditVehicle/${car.carId || car.id}`)
                        }
                        className="admin-btn admin-btn-primary admin-btn-sm"
                      >
                        Edit
                        </button>

                      <button
                        onClick={() => openDeleteModal(car.carId || car.id)}
                        className="admin-btn admin-btn-danger admin-btn-sm"
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
        <div className="admin-no-vehicles">
          <h3>No vehicles available</h3>
          <p>Please add some vehicles to your inventory.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this vehicle? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary closeModalbtn" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <>
          <nav className="admin-pagination-nav">
            <ul className="admin-pagination">
              <li
                className={`admin-page-item ${currentPage <= 1 ? "disabled" : ""}`}
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
                  className={`admin-page-item ${
                    i + 1 === currentPage ? "active" : ""
                  }`}
                >
                  <button onClick={(e) => handlePageChange(e, i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`admin-page-item ${
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

          <div className="admin-pagination-info">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalCars)} of {totalCars} vehicles
          </div>
        </>
      )}
    </div>
  );
};

export default AdminInventory;
