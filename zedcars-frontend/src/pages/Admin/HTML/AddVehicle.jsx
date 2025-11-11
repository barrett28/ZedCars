import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";

const AddVehicle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    variant: "",
    year: "",
    price: "",
    stockQuantity: "",
    color: "",
    fuelType: "",
    transmission: "",
    mileage: "",
    description: "",
    imageUrl: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/admin/vehicle", formData);
      setMessage({ type: "success", text: "Vehicle added successfully!" });
      setTimeout(() => navigate("/Admin/Inventory"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add vehicle. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-vehicle-page">
      <div className="admin-header">
        <h1>Add New Vehicle</h1>
        <p className="lead">Add a new vehicle to the inventory</p>
        
        <div className="admin-actions">
          <button onClick={() => navigate("/Admin/Dashboard")} className="btn btn-secondary">
            Back to Dashboard
          </button>
          <button onClick={() => navigate("/Admin/Inventory")} className="btn btn-secondary">
            View Inventory
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
          {message.text}
        </div>
      )}

      <div className="vehicle-form-container">
        <form onSubmit={handleSubmit} id="add-vehicle-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Brand</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes">Mercedes</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Audi">Audi</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Chevrolet">Chevrolet</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. Camry"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="variant">Variant</label>
                <input
                  type="text"
                  name="variant"
                  value={formData.variant}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. LE, Sport Edition"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="2024"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Pricing & Stock</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="24000"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="stockQuantity">Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Specifications</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. White"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fuelType">Fuel Type</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="transmission">Transmission</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="mileage">Mileage (MPG)</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="28"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Details</h3>
            
            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="form-control"
                placeholder="Enter vehicle description..."
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="form-control"
                placeholder="https://example.com/car-image.jpg"
              />
              <small className="form-text">Leave empty to auto-generate based on brand and model</small>
            </div>
          </div>

          <div className="form-actions d-flex justify-content-center align-content-center">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Vehicle"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/Admin/Dashboard")}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .admin-header {
          background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
          color: white;
          padding: 30px;
        }
        
        .admin-actions {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }
        
        .btn {
          padding: 10px 20px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          border: none;
          cursor: pointer;
        }
        
        .btn-primary {
          background: #3498db;
          color: white;
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .vehicle-form-container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        
        .form-section:last-child {
          border-bottom: none;
        }
        
        .form-section h3 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 1.3em;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .form-control {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-control:focus {
          border-color: #3498db;
          outline: none;
          box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
        }
        
        .form-text {
          color: #6c757d;
          font-size: 12px;
          margin-top: 5px;
        }
        
        .form-actions {
          margin-top: 30px;
          display: flex;
          gap: 15px;
        }
        
        .alert {
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        
        .alert-success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `}</style>
    </div>
  );
};

export default AddVehicle;
