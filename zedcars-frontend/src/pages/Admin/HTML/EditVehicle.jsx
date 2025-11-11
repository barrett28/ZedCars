import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/apiClient";

const EditVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    carId: "",
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        console.log("Fetching vehicle with ID:", id);
        console.log("JWT Token:", localStorage.getItem("jwtToken"));
        const response = await apiClient.get(`/admin/vehicles/${id}`);
        console.log("Vehicle data received:", response.data);
        const vehicle = response.data;
        setFormData({
          carId: vehicle.carId || vehicle.id,
          brand: vehicle.brand || vehicle.Brand || "",
          model: vehicle.model || vehicle.Model || "",
          variant: vehicle.variant || vehicle.Variant || "",
          year: vehicle.year || vehicle.Year || "",
          price: vehicle.price || vehicle.Price || "",
          stockQuantity: vehicle.stockQuantity || vehicle.StockQuantity || "",
          color: vehicle.color || vehicle.Color || "",
          fuelType: vehicle.fuelType || vehicle.FuelType || "",
          transmission: vehicle.transmission || vehicle.Transmission || "",
          mileage: vehicle.mileage || vehicle.Mileage || "",
          description: vehicle.description || vehicle.Description || "",
          imageUrl: vehicle.imageUrl || vehicle.ImageUrl || ""
        });
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        console.error("Error response:", error.response);
        setMessage({ type: "error", text: "Failed to load vehicle details." });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Map frontend field names to backend model
      const backendData = {
        carId: formData.carId,
        Brand: formData.brand,
        Model: formData.model,
        Variant: formData.variant,
        Year: formData.year,
        Price: parseFloat(formData.price),
        StockQuantity: parseInt(formData.stockQuantity) || 0,
        Color: formData.color,
        FuelType: formData.fuelType,
        Transmission: formData.transmission,
        Mileage: parseInt(formData.mileage) || 0,
        Description: formData.description,
        ImageUrl: formData.imageUrl
      };
      
      await apiClient.put(`/admin/vehicles/${id}`, backendData);
      setMessage({ type: "success", text: "Vehicle updated successfully!" });
      setTimeout(() => navigate("/Admin/AdminInventory"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update vehicle. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading vehicle details...</div>;
  }

  return (
    <div className="edit-vehicle-page">
      <div className="admin-header">
        <h1>Edit Vehicle</h1>
        <p className="lead">Edit your vehicle from Inventory.</p>

        <div className="admin-actions">
          <button onClick={() => navigate("/Admin/Dashboard")} className="btn btn-secondary">
            Back to Dashboard
          </button>
          <button onClick={() => navigate("/Admin/AdminInventory")} className="btn btn-secondary">
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
        <form onSubmit={handleSubmit} id="edit-vehicle-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <input type="hidden" name="carId" value={formData.carId} />
            
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

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Updating..." : "Update Vehicle"}
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
          margin: -30px -30px 30px -30px;
          border-radius: 8px 8px 0 0;
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
          justify-content: flex-end;
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

        .loading {
          text-align: center;
          padding: 2rem;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default EditVehicle;
