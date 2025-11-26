import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import "../CSS/AddVehicle.css";

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
    imageUrl: "", // JSON string of URLs
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // Multi-image handling states
  const [imageUrls, setImageUrls] = useState([]);
  const [urlInput, setUrlInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "price" || name === "stockQuantity" || name === "mileage") && value < 0) return;

    if (name === "year" && (value < 1900 || value > 2030)) return;

    if (name === "color") {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData({ ...formData, [name]: lettersOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add a single image URL
  const addImageFromUrl = (url) => {
    url = url.trim();
    if (!url || imageUrls.includes(url)) return;

    const img = new Image();
    img.onload = () => {
      const newImageUrls = [...imageUrls, url];
      setImageUrls(newImageUrls);
      setFormData({ ...formData, imageUrl: JSON.stringify(newImageUrls) });
    };
    img.onerror = () => {
      alert(`Failed to load image: ${url}`);
    };
    img.src = url;
  };

  // Add multiple image URLs
  const handleAddImages = () => {
    const text = urlInput.trim();
    if (!text) return;

    const urls = text.split(/\s+|,|\n/).filter(Boolean);
    urls.forEach(addImageFromUrl);
    setUrlInput("");
  };

  // Remove an image
  const removeImage = (urlToRemove) => {
    const newImageUrls = imageUrls.filter((u) => u !== urlToRemove);
    setImageUrls(newImageUrls);
    setFormData({ ...formData, imageUrl: JSON.stringify(newImageUrls) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/admin/vehicles", formData);
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
              <h3>Images & Description</h3>

              <div className="admin-form-group">
                <label>Vehicle Images (URLs)</label>
                <div className="url-input-zone">
                  <p>Paste one or more image URLs (line-by-line, comma, or space)</p>

                  <textarea
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/car1.jpg&#10;https://example.com/car2.png"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleAddImages();
                      }
                    }}
                  />

                  <button type="button" onClick={handleAddImages} className="add-images-btn">
                    Add Images
                  </button>
                </div>
              </div>

              {imageUrls.length > 0 && (
                <div className="preview-container">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="image-preview">
                      <img src={url} alt={`Preview ${index + 1}`} />
                      <button type="button" className="remove-btn" onClick={() => removeImage(url)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imageUrls.length > 0 && (
                <div className="url-list">
                  <h4>Current URLs ({imageUrls.length}):</h4>
                  <div className="url-items">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="url-item">
                        {index + 1}. {url}
                      </div>
                    ))}
                  </div>
                </div>
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

                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => navigate("/Admin/AdminInventory")}>
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
