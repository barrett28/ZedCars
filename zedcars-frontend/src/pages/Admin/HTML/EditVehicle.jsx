import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import "../CSS/AddVehicle.css";

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

  if (loading) return <div className="admin-loading">Loading vehicle details...</div>;

  return (
    <div className="admin-add-vehicle-page">
      <header className="admin-header">
        <h1>Edit Vehicle</h1>
        <p>Edit an existing vehicle in your inventory.</p>
        <div className="admin-actions">
          <button onClick={() => navigate("/Admin/Dashboard")} className="admin-btn admin-btn-secondary">
            Back to Dashboard
          </button>
          <button onClick={() => navigate("/Admin/AdminInventory")} className="admin-btn admin-btn-secondary">
            View Inventory
          </button>
        </div>
      </header>

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
              <input type="hidden" name="carId" value={formData.carId} />

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
                <input type="number" name="year" value={formData.year} onChange={handleChange} />
              </div>

              <div className="admin-form-group">
                <label>Price ($)</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
              </div>

              <div className="admin-form-group">
                <label>Stock Quantity</label>
                <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} />
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
                <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} />
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
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? "Updating..." : "Update Vehicle"}
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

export default EditVehicle;
