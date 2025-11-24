import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import "../CSS/AddVehicle.css"

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
    imageUrl: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'price' || name === 'stockQuantity' || name === 'mileage') && value < 0) return;
    if (name === 'year' && (value < 1900 || value > 2030)) return;
    if (name === 'color') {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData({ ...formData, [name]: lettersOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/admin/vehicle", formData);
      setMessage({ type: "success", text: "Vehicle added successfully!" });
      setTimeout(() => navigate("/Admin/AdminInventory"), 2000);
    } catch {
      setMessage({ type: "error", text: "Failed to add vehicle. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-vehicle-page">
      {/* <header className="admin-header">
        <h1>Add New Vehicle</h1>
        <p>Add a new vehicle to your inventory.</p>
        <div className="admin-actions">
          <button onClick={() => navigate("/Admin/Dashboard")} className="admin-btn admin-btn-secondary">
            Back to Dashboard
          </button>
          <button onClick={() => navigate("/Admin/AdminInventory")} className="admin-btn admin-btn-secondary">
            View Inventory
          </button>
        </div>
      </header> */}

      {message.text && (
        <div className={`admin-alert ${message.type === "success" ? "admin-alert-success" : "admin-alert-danger"}`}>
          {message.text}
        </div>
      )}

      <div className="admin-form-container">
        <form onSubmit={handleSubmit} id="admin-vehicle-form">
          <div className="admin-grid">
            {/* LEFT COLUMN */}
            <div className="admin-form-column">
              <h3>Basic Details</h3>

              <div className="admin-form-group">
                <label>Brand</label>
                <select name="brand" value={formData.brand} onChange={handleChange} required>
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

              <div className="admin-form-group">
                <label>Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} required />
              </div>

              <div className="admin-form-group">
                <label>Variant</label>
                <input type="text" name="variant" value={formData.variant} onChange={handleChange} />
              </div>

              <div className="admin-form-group">
                <label>Year</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} min="1900" max="2030" />
              </div>

              <div className="admin-form-group">
                <label>Price ($)</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} min="0" required />
              </div>

              <div className="admin-form-group">
                <label>Stock Quantity</label>
                <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} min="0" />
              </div>

              <div className="admin-form-group">
                <label>Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} />
              </div>

              <div className="admin-form-group">
                <label>Fuel Type</label>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                  <option value="">Select Fuel Type</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange}>
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Mileage (MPG)</label>
                <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} min="0" />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="admin-form-column">
              <h3>Image & Description</h3>

              <div className="admin-form-group">
                <label>Image URL</label>
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
              </div>

              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Car Preview" className="admin-preview-image" />
              )}

              <div className="admin-form-group mt-3">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Enter vehicle description..."
                />
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                  {loading ? "Adding..." : "Add Vehicle"}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => navigate("/Admin/AdminInventory")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
